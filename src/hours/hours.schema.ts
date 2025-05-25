import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

@Schema()
export class HoursType extends Document {
  @Prop({ required: true, ref: 'DaysType' })
  daysID: ObjectId | string;

  @Prop({ required: true })
  value: string;
}

export const HoursTypeSchema = SchemaFactory.createForClass(HoursType);
export type HoursDocument = HoursType & Document;
