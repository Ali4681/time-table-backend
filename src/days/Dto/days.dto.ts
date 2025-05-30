import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class DayDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['Monday', 'Tuesday', 'Wednesday', 'Friday', 'Saturday', 'Sunday'], {
    message: 'Day must be a valid weekday',
  })
  name: string;
}
