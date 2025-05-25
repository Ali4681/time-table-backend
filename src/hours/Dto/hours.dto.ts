import { IsString, IsNotEmpty } from 'class-validator';

export class CreateHoursDto {
  @IsString()
  @IsNotEmpty()
  daysID: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}
