import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class PracticalDto {
  @IsString()
  @IsNotEmpty()
  theoretical: string;

  @IsString()
  @IsNotEmpty()
  CategoryCode: string;

  @IsNumber()
  @Min(1)
  capacity: number;
}
