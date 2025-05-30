import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class PracticalType extends Document {
  @Prop({ required: true })
  CategoryCode: string;

  @Prop({ required: true, min: 1 })
  capacity: number;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'TheoreticalType',
  })
  theoretical: Types.ObjectId;
}

export const PracticalTypeSchema = SchemaFactory.createForClass(PracticalType);
