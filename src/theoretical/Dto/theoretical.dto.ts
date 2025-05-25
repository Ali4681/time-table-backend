import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  Matches,
} from 'class-validator';

export class CreateTheoreticalDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z]{2,5}$/, {
    message: 'Category code must be 2-5 uppercase letters',
  })
  categoryCode: string;

  @IsNumber()
  @Min(1)
  @Max(500)
  capacity: number;
}
