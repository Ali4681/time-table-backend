// docteach.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocTeachType, DocTeachTypeSchema } from './docteach.schema';
import { DocTeachService } from './docteach.service';
import { HoursType, HoursTypeSchema } from 'src/hours/hours.schema';
import { DocHourSchema, DocHourType } from './doc-hour.schema';
import { DocTeachController } from './docteach.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DocTeachType.name, schema: DocTeachTypeSchema },
      { name: HoursType.name, schema: HoursTypeSchema },
      { name: DocHourType.name, schema: DocHourSchema }, 
    ]),
  ],
  controllers: [DocTeachController],
  providers: [DocTeachService],
})
export class DocTeachModule {}
