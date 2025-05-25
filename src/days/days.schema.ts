import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class DaysType extends Document {
  @Prop({
    required: true,
    unique: true,
    trim: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Friday', 'Saturday', 'Sunday'],
  })
  name: string;
}

export const DaysTypeSchema = SchemaFactory.createForClass(DaysType);
