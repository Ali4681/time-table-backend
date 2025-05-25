// docteach.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocTeachController } from './docteach.controller';
import { DocTeachType, DocTeachTypeSchema } from './docteach.schema';
import { DocTeachService } from './docteach.service';
import { HoursType, HoursTypeSchema } from 'src/hours/hours.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DocTeachType.name, schema: DocTeachTypeSchema },
      { name: HoursType.name, schema: HoursTypeSchema },
    ]),
  ],
  controllers: [DocTeachController],
  providers: [DocTeachService],
})
export class DocTeachModule {}
