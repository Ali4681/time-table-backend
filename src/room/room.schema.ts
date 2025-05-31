import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class RoomType extends Document {
  @Prop({
    required: true,
    trim: true,
    unique: true,
  })
  name: string;

  @Prop({
    required: true,
    min: 1,
  })
  capacity: number;


}

export const RoomTypeSchema = SchemaFactory.createForClass(RoomType);
export type RoomeDocument = RoomType & Document;
