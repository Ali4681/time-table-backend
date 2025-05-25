import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class CreateDayDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['Monday', 'Tuesday', 'Wednesday', 'Friday', 'Saturday', 'Sunday'], {
    message: 'Day must be a valid weekday',
  })
  name: string;
}
