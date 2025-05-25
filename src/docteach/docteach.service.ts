// docteach.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DocTeachType } from './docteach.schema';
import { DocTeachDto } from './Dto/docteach.dto';
import { HoursType } from 'src/hours/hours.schema';

@Injectable()
export class DocTeachService {
  constructor(
    @InjectModel(DocTeachType.name) private modeldoc: Model<DocTeachType>,
    @InjectModel(HoursType.name) private modelhour: Model<HoursType>,
  ) {}

  async create(data: DocTeachDto) {
    const { hourIds, ...rest } = data;
    const doc = new this.modeldoc(rest);
    const newDoc = await doc.save();
    hourIds &&
      hourIds.forEach((id) => {
        new this.modelhour({
          docId: newDoc._id,
          hourId: id,
        }).save();
        return newDoc;
      });
  }

  findAll() {
    return this.modeldoc.find().populate('hourIds').exec();
  }

  async findOne(id: string) {
    const item = await this.modeldoc.findById(id).populate('hourIds');
    if (!item) throw new NotFoundException('DocTeach not found');
    return item;
  }

  async update(id: string, dto: DocTeachDto) {
    const updated = await this.modeldoc.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!updated) throw new NotFoundException('DocTeach not found');
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.modeldoc.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('DocTeach not found');
    return deleted;
  }
}
