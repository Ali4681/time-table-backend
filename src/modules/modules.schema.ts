import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';

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
  @Prop({ required: true, default: 0 })
  erolledStudents: number;

  @Prop({
    type: Types.ObjectId,
    ref: 'DocTeachType',
    required: true,
  })
  doctorsId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'DocTeachType', required: true })
  teacherId: Types.ObjectId;
}

export const ModulesTypeSchema = SchemaFactory.createForClass(ModulesType);
