import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TheoreticalType } from './theoretical.schema';
import { TheoreticalDto } from './Dto/theoretical.dto';

@Injectable()
export class TheoreticalService {
  constructor(
    @InjectModel(TheoreticalType.name)
    private readonly model: Model<TheoreticalType>,
  ) {}

  async create(dto: TheoreticalDto): Promise<TheoreticalType> {
    return await this.model.create(dto);
  }

  async findAll() {
    const theoretical = await this.model
      .aggregate([
        {
          $lookup: {
            from: 'practicaltypes', // اسم الـ collection للدروس (يجب أن يكون الاسم الصحيح في MongoDB)
            localField: '_id', // من course
            foreignField: 'theoretical', // من lesson
            as: 'practical', // النتيجة تُخزن في هذا الحقل
          },
        },
      ])
      .exec();

    return theoretical;
  }

  async findOne(id: string): Promise<TheoreticalType> {
    const item = await this.model.findById(id).exec();
    if (!item) throw new NotFoundException(`Type with ID ${id} not found`);
    return item;
  }

  async update(id: string, dto: TheoreticalDto): Promise<TheoreticalType> {
    const updated = await this.model
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException(`Type with ID ${id} not found`);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.model.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Type with ID ${id} not found`);
  }
}
