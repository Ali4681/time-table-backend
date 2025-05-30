import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DaysType } from './days.schema';
import { DayDto } from './Dto/days.dto';

@Injectable()
export class DaysService {
  constructor(
    @InjectModel(DaysType.name) private readonly dayModel: Model<DaysType>,
  ) {}

  async create(createDayDto: DayDto): Promise<DaysType> {
    const existing = await this.dayModel.findOne({ name: createDayDto.name });
    if (existing) {
      throw new ConflictException('Day already exists');
    }
    return this.dayModel.create(createDayDto);
  }

  async findAll(): Promise<DaysType[]> {
    return this.dayModel.find().exec();
  }


  async update(id: string, updateDayDto: DayDto): Promise<DaysType> {
    const updated = await this.dayModel.findByIdAndUpdate(id, updateDayDto, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      throw new NotFoundException('Day not found');
    }
    return updated;
  }

  async remove(id: string): Promise<DaysType> {
    const deleted = await this.dayModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundException('Day not found');
    }
    return deleted;
  }
}
