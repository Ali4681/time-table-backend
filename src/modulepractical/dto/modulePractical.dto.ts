import { Prop } from '@nestjs/mongoose';
import { IsString } from 'class-validator';

import { ObjectId, Types } from 'mongoose';

export class ModulePracticalDto {
  @IsString()
  practical: string;

  @IsString()
  module: string;
}
