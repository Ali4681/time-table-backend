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
    @InjectModel(HoursType.name)
    private readonly hoursModel: Model<HoursType>,
  ) {}

  async create(createHoursDto: HoursDto): Promise<HoursType> {
    try {
      const newHour = new this.hoursModel({
        ...createHoursDto,
        daysId: new Types.ObjectId(createHoursDto.daysId),
      });
      return await newHour.save();
    } catch (error) {
      throw new BadRequestException('Invalid daysId format');
    }
  }

  async findAll(): Promise<HoursType[]> {
    return this.hoursModel.find().populate('daysId').exec();
  }

  async update(id: string, updateHoursDto: HoursDto): Promise<HoursType> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid id');
    }

    try {
      const updateData = {
        ...updateHoursDto,
        daysId: new Types.ObjectId(updateHoursDto.daysId),
      };

      const updated = await this.hoursModel
        .findByIdAndUpdate(new Types.ObjectId(id), updateData, {
          new: true,
          runValidators: true,
        })
        .exec();

      if (!updated) {
        throw new NotFoundException('Hour not found');
      }
      return updated;
    } catch (error) {
      throw new BadRequestException('Invalid daysId format');
    }
  }

  async remove(id: string): Promise<HoursType> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid id');
    }

    const deleted = await this.hoursModel
      .findByIdAndDelete(new Types.ObjectId(id))
      .exec();
    if (!deleted) {
      throw new NotFoundException('Hour not found');
    }
    return deleted;
  }
}
