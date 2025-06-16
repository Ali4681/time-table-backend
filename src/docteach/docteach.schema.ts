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

DocTeachTypeSchema.pre('findOneAndDelete', async function (next) {
  const doc = await this.model.findOne(this.getFilter());
  if (doc) {
    const DocHourModel = doc.model('DocHourType');
    await DocHourModel.deleteMany({ docId: doc._id });
  }
  next();
});
