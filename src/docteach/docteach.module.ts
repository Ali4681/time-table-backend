// docteach.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocTeachController } from './docteach.controller';
import { DocTeachType, DocTeachTypeSchema } from './docteach.schema';
import { DocTeachService } from './docteach.service';
import { DocTeachController } from './doc-teach.controller';

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
