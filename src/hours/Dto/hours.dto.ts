import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class HoursDto {
  @IsNotEmpty()
  daysId: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  value: string;
}
