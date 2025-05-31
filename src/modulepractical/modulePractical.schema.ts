import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, Types } from 'mongoose';



@Schema()
export class ModulePractical extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: 'PracticalType',
    required: true,
  })
  practical: Types.ObjectId | string;

  @Prop({
    type: Types.ObjectId,
    ref: 'ModulesType',
    required: true,
  })
  module: Types.ObjectId | string;
}


export const ModulePracticalSchema = SchemaFactory.createForClass(ModulePractical);


