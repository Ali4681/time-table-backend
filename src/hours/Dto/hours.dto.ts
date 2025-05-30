import { IsString, IsNotEmpty } from 'class-validator';

export class HoursDto {
  @IsString()
  @IsNotEmpty()
  daysId: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}
