import { Module } from '@nestjs/common';
import { DocTeachService } from './docteach.service';
import { DocTeachController } from './doc-teach.controller';

@Module({
  controllers: [DocTeachController],
  providers: [DocTeachService],
})
export class DocTeachModule {}
