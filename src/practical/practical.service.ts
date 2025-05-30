import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PracticalType } from './practical.schema';
import { PracticalDto } from './Dto/practical.dto';

@Injectable()
export class PracticalService {
  constructor(
    @InjectModel(PracticalType.name)
    private readonly model: Model<PracticalType>,
  ) {}

  async create(dto: PracticalDto): Promise<PracticalType> {
    return this.model.create({
      CategoryCode: dto.CategoryCode,
      theoretical: new Types.ObjectId(dto.theoretical),
      capacity: dto.capacity,
    });
  }

  async findAll(): Promise<PracticalType[]> {
    return this.model.find().exec();
  }

  async findOne(id: string): Promise<PracticalType> {
    const item = await this.model.findById(id).exec();

    if (!item)
      throw new NotFoundException(`PracticalType with ID ${id} not found`);
    return item;
  }

  async update(id: string, dto: PracticalDto): Promise<PracticalType> {
    const updated = await this.model
      .findByIdAndUpdate(id, dto, { new: true }).exec();

    if (!updated)
      throw new NotFoundException(`PracticalType with ID ${id} not found`);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.model.findByIdAndDelete(id).exec();
    if (!result)
      throw new NotFoundException(`PracticalType with ID ${id} not found`);
  }
}
