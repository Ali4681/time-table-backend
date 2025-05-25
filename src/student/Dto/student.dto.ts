import { IsString, IsNotEmpty, IsArray, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '2023' })
  @IsString()
  @IsNotEmpty()
  years: string;

  @ApiProperty({ example: '+1234567890' })
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({ example: ['CS101', 'MATH202'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  modules?: string[];
}
