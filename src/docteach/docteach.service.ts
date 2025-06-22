import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DocTeachType } from './docteach.schema';
import { DocTeachDto } from './Dto/docteach.dto';
import { HoursType } from 'src/hours/hours.schema';
import { DocHourType } from './doc-hour.schema';
import { DaysType } from 'src/days/days.schema';

@Injectable()
export class DocTeachService {
  constructor(
    @InjectModel(DocTeachType.name) private modeldoc: Model<DocTeachType>,
    @InjectModel(HoursType.name) private modelhour: Model<HoursType>,
    @InjectModel(DocHourType.name) private docHourModel: Model<DocHourType>,
  ) {}

  async create(data: DocTeachDto) {
    const { hourIds, ...rest } = data;
    const doc = new this.modeldoc(rest);
    const newDoc = await doc.save();

    if (hourIds && hourIds.length > 0) {
      await Promise.all(
        hourIds.map((id) =>
          new this.docHourModel({
            docId: newDoc._id,
            hourId: new Types.ObjectId(id),
          }).save(),
        ),
      );
    }

    return newDoc;
  }

  async findAll() {
    const docHours = await this.docHourModel
      .find()
      .populate({
        path: 'hourId',
        populate: {
          path: 'daysId',
          model: DaysType.name, // Use the actual model name here
        },
      })
      .populate('docId')
      .exec();

    // Group hours by doctor ID
    const groupedResults = docHours.reduce((acc, docHour) => {
      const doctorId = docHour.docId._id.toString();
      if (!acc[doctorId]) {
        acc[doctorId] = {
          doctor: docHour.docId,
          hours: [],
        };
      }
      acc[doctorId].hours.push(docHour.hourId);
      return acc;
    }, {});

    return Object.values(groupedResults);
  }

  async findOne(id: string) {
    const doc = await this.modeldoc.findById(id).exec();
    if (!doc) throw new NotFoundException('DocTeach not found');

    const docHours = await this.docHourModel
      .find({ docId: doc._id })
      .populate('hourId')
      .exec();

    const hours = docHours.map((dh) => dh.hourId);

    return {
      ...doc.toObject(),
      hours,
    };
  }

  async update(id: string, dto: DocTeachDto) {
    const updated = await this.modeldoc
      .findByIdAndUpdate(id, dto, {
        new: true,
      })
      .exec();
    if (!updated) throw new NotFoundException('DocTeach not found');

    // Handle hour updates if hourIds are provided
    if (dto.hourIds) {
      // First, remove all existing hour associations for this doctor
      await this.docHourModel.deleteMany({ docId: id }).exec();

      // Then create new associations for each hourId in the dto
      if (dto.hourIds.length > 0) {
        await Promise.all(
          dto.hourIds.map((hourId) =>
            new this.docHourModel({
              docId: id,
              hourId: new Types.ObjectId(hourId),
            }).save(),
          ),
        );
      }
    }

    // Return the updated doctor with populated hours
    return this.findOne(id);
  }

  async remove(id: string) {
    const deleted = await this.modeldoc.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('DocTeach not found');

    await this.docHourModel.deleteMany({ docId: id }).exec();
    return deleted;
  }
}
