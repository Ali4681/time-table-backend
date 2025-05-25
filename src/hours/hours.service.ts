import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { HoursType } from './hours.schema';
import { HoursDto } from './Dto/hours.dto';

@Injectable()
export class HoursService {
  constructor(
    @InjectModel(HoursType.name) private readonly hoursModel: Model<HoursType>,
  ) {}

  async create(createHoursDto: HoursDto): Promise<HoursType> {
    // تحقق من صحة ObjectId قبل الحفظ
    if (!Types.ObjectId.isValid(createHoursDto.daysId)) {
      throw new BadRequestException('Invalid daysId');
    }
    const createdHour = new this.hoursModel(createHoursDto);
    return createdHour.save();
  }

  async findAll(): Promise<HoursType[]> {
    return this.hoursModel.find().populate('daysId').exec();
  }

  async update(id: string, updateHoursDto: HoursDto): Promise<HoursType> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid id');
    }
    if (
      updateHoursDto.daysId &&
      !Types.ObjectId.isValid(updateHoursDto.daysId)
    ) {
      throw new BadRequestException('Invalid daysId');
    }
    const updated = await this.hoursModel
      .findByIdAndUpdate(id, updateHoursDto, {
        new: true,
        runValidators: true,
      })
      .exec();
    if (!updated) {
      throw new NotFoundException('Hour not found');
    }
    return updated;
  }

  async remove(id: string): Promise<HoursType> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid id');
    }
    const deleted = await this.hoursModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('Hour not found');
    }
    return deleted;
  }
}
