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
  years: number[];

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsNumber()
  @Min(1)
  hours: number;

  @IsString()
  @IsNotEmpty()
  doctors: string;

  @IsString()
  @IsNotEmpty()
  teacher: string;
}
