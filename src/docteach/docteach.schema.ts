import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class DocTeachType extends Document {
  @Prop({ required: true })
  declare id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: [String], default: [] })
  availableAt: string[];

  @Prop({ default: false })
  isDoctor: boolean;
}

export const DocTeachTypeSchema = SchemaFactory.createForClass(DocTeachType);
export type DocTeachDocument = DocTeachType & Document;
