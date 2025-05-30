import { IsString, IsArray, IsBoolean, IsOptional } from 'class-validator';

export class DocTeachDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  hourIds?: string[];

  @IsBoolean()
  @IsOptional()
  isDoctor?: boolean;
}
