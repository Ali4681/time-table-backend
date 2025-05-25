import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class DocTeachType extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ default: false })
  isDoctor: boolean;
}

export const DocTeachTypeSchema = SchemaFactory.createForClass(DocTeachType);
