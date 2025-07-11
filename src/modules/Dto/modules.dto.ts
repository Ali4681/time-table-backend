import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsNumber,
  Min,
  IsInt,
  ArrayMinSize,
} from 'class-validator';

export class ModuleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  years: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsNumber()
  @Min(1)
  hours: string;

  @IsString()
  @IsNotEmpty()
  doctors: string;
  
  @IsNumber()
  erolledStudents: number;

  @IsString()
  @IsNotEmpty()
  teacher: string;
}
