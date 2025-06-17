import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class StudentType extends Document {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the student' })
  @Prop({ required: true, trim: true })
  name: string;

  @ApiProperty({ example: '2023', description: 'Academic year' })
  @Prop({ required: true })
  years: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Phone number with country code',
  })
  @Prop({ required: true, unique: true })
  phoneNumber: string;

  
}

export const StudentTypeSchema = SchemaFactory.createForClass(StudentType);
