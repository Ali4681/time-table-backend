// link-to-room.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { linkToRoomType } from './linkToRoom.schema';
import { LinkToRoomDto } from './Dto/linkToRoom.dto';

@Injectable()
export class LinkToRoomService {
  constructor(
    @InjectModel(linkToRoomType.name)
    private readonly linkToRoomModel: Model<linkToRoomType>,
  ) {}

  async create(Dto: LinkToRoomDto): Promise<linkToRoomType> {
    const created = new this.linkToRoomModel(Dto);
    return created.save();
  }

  async findAll() {
    return this.linkToRoomModel
      .find()
      .populate('sessionTimeId')
      .populate('moduleId')
      .populate('roomId')
      .exec();
  }

  async findOne(id: string) {
    const result = await this.linkToRoomModel
      .find({ roomId: id })
      .populate('sessionTimeId')
      .populate('moduleId')
      .populate('roomId')
      .exec();

    if (!result) {
      throw new NotFoundException('LinkToRoom not found');
    }
    return result;
  }

  async update(id: string, updateDto: LinkToRoomDto): Promise<linkToRoomType> {
    const result = await this.linkToRoomModel
      .findByIdAndUpdate(id, updateDto, {
        new: true,
      })
      .populate('sessionTimeId')
      .populate('moduleId')
      .populate('roomId')
      .exec();

    if (!result) {
      throw new NotFoundException('LinkToRoom not found');
    }
    return result;
  }

  async remove(id: string): Promise<linkToRoomType> {
    const result = await this.linkToRoomModel
      .findByIdAndDelete(id)
      .populate('sessionTimeId')
      .populate('moduleId')
      .populate('roomId')
      .exec();

    if (!result) {
      throw new NotFoundException('LinkToRoom not found');
    }
    return result;
  }
}
