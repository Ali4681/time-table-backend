import { IsString, IsNotEmpty, IsArray, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StudentDto {
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


  @IsArray()
  modules:string[];
}
