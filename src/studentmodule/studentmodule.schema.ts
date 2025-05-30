import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';

@Schema({ timestamps: true })
export class StudentModuleType extends Document {
  @Prop({ type: Types.ObjectId, ref: 'StudentType' })
  student: ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'ModulesType' })
  module: ObjectId;
  @Prop()
  registrationDate: Date;
  @Prop({ type: Types.ObjectId, ref: 'PracticalType' })
  Practical: ObjectId;
}

export const StudentModuleTypeSchema = SchemaFactory.createForClass(StudentModuleType);
