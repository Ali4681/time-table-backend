// room.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoomeDocument, RoomType } from './room.schema';
import { RoomDto } from './dto/room.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(RoomType.name) private roomModel: Model<RoomeDocument>,
  ) {}

  async create(createRoomDto: RoomDto): Promise<RoomType> {
    const newRoom = new this.roomModel(createRoomDto);
    return newRoom.save(); // uses .save()
  }

  async findAll(): Promise<RoomType[]> {
    return this.roomModel.find().exec(); // uses .exec()
  }

  async findOne(id: string): Promise<RoomType> {
    const room = await this.roomModel.findById(id).exec(); // uses .exec()
    if (!room) throw new NotFoundException('Room not found');
    return room;
  }

  async update(id: string, updateRoomDto: RoomDto): Promise<RoomType> {
    const room = await this.roomModel
      .findByIdAndUpdate(id, updateRoomDto, { new: true })
      .exec(); // uses .exec()
    if (!room) throw new NotFoundException('Room not found');
    return room;
  }

  async remove(id: string): Promise<void> {
    const result = await this.roomModel.findByIdAndDelete(id).exec(); // uses .exec()
    if (!result) throw new NotFoundException('Room not found');
  }
}
