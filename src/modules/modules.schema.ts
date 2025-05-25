import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

@Schema()
export class ModulesType extends Document {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: [Number], required: true })
  years: number[];

  @Prop({ required: true, unique: true, uppercase: true, trim: true })
  code: string;

  @Prop({ required: true, min: 1 })
  hours: number;

  @Prop({ required: true, trim: true, ref: 'DocTeachType' })
  doctorsId: ObjectId | string;

  @Prop({ required: true, trim: true, ref: 'DocTeachType' })
  teacherId: ObjectId | string;
}

export const ModulesTypeSchema = SchemaFactory.createForClass(ModulesType);
export type ModulesDocument = ModulesType & Document;
