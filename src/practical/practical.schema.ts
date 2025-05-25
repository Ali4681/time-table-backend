import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

@Schema()
export class PracticalType extends Document {
  @Prop({ required: true, ref: 'TheoreticalType' })
  theoreticalId: ObjectId | string;

  @Prop({ required: true })
  CategoryCode: string;

  @Prop({ required: true, min: 1 })
  capacity: number;
}

export const PracticalTypeSchema = SchemaFactory.createForClass(PracticalType);
export type PracticalDocument = PracticalType & Document;
