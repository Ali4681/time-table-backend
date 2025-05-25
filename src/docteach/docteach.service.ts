import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DocTeachType } from './docteach.schema';
import { DocTeachDto } from './Dto/docteach.dto';
import { HoursType } from 'src/hours/hours.schema';
import { DocHourType } from './doc-hour.schema';

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
            hourId: id,
          }).save(),
        ),
      );
    }

    return newDoc;
  }

  async findAll() {
    const docs = await this.modeldoc.find().exec();
    const results = await Promise.all(
      docs.map(async (doc) => {
        const docHours = await this.docHourModel
          .find({ docId: doc._id })
          .populate('hourId') // populate ساعات
          .exec();

        const hours = docHours.map((dh) => dh.hourId); // استخرج الساعات فقط

        return {
          ...doc.toObject(),
          hours, // أضف الساعات للنتيجة
        };
      }),
    );
    return results;
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
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.modeldoc.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('DocTeach not found');

    await this.docHourModel.deleteMany({ docId: id }).exec(); // امسح العلاقات أيضاً
    return deleted;
  }
}
