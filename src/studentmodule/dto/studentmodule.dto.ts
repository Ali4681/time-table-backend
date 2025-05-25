import { IsString } from 'class-validator';

export class StudentModuleDto {
  @IsString()
  student: string;
  @IsString()
  module: string;
  @IsString()
  registrationDate: Date;
  @IsString()
  Practical: string;
}
