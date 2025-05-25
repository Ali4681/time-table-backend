import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  Matches,
} from 'class-validator';

export class TheoreticalDto {
  @IsString()
  @IsNotEmpty()
 
  categoryCode: string;

  @IsNumber()
  @Min(1)
  @Max(500)
  capacity: number;
}
