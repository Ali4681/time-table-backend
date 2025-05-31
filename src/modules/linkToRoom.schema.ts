import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';

@Schema()
export class linkToRoomType extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: 'HoursType',
    required: true,
  })
  sessionTimeId: Types.ObjectId | string;

  @Prop({
    type: Types.ObjectId,
    ref: 'ModulesType',
    required: true,
  })
  moduleId: Types.ObjectId | string;

  @Prop({ type: Types.ObjectId, ref: 'RoomType', required: true })
  roomId: Types.ObjectId | string;
}

export const linkToRoomTypeSchema =
  SchemaFactory.createForClass(linkToRoomType);
