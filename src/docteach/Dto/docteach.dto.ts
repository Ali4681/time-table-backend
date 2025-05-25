import { IsString, IsArray, IsBoolean, IsOptional } from 'class-validator';

export class CreateDocTeachDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  availableAt?: string[];

  @IsBoolean()
  @IsOptional()
  isDoctor?: boolean;
}
