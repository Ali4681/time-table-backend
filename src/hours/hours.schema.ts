import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class HoursType extends Document {
  @Prop({ type: Types.ObjectId, ref: 'DaysType', required: true })
  daysId: Types.ObjectId;

  @Prop({ required: true })
  value: string;
}

export const HoursTypeSchema = SchemaFactory.createForClass(HoursType);
