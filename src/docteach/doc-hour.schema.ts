import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class DocHourType extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'DocTeachType' })
  docId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'HoursType' })
  hourId: Types.ObjectId;
}

export const DocHourSchema = SchemaFactory.createForClass(DocHourType);
  