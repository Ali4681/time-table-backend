import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class TheoreticalType extends Document {
  @Prop({
    required: true,
    uppercase: true,
    trim: true,
    match: /^[A-Z]{2,5}$/,
  })
  categoryCode: string;

  @Prop({
    required: true,
    min: 1,
    max: 500,
  })
  capacity: number;
}

export const TheoreticalTypeSchema =
  SchemaFactory.createForClass(TheoreticalType);
export type TheoreticaleDocument = TheoreticalType & Document;
