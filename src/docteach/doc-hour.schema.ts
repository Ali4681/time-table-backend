import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';

@Schema()
export class DocTeachType extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'DocTeachType' })
  docId: ObjectId;
  @Prop({ required: true, type: Types.ObjectId, ref: 'HoursType' })
  hourId: ObjectId;
}

export const DocTeachTypeSchema = SchemaFactory.createForClass(DocTeachType);
