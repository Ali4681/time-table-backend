import { Module } from '@nestjs/common';
import { DocTeachService } from './docteach.service';
import { DocTeachController } from './docteach.controller';

@Module({
  controllers: [DocTeachController],
  providers: [DocTeachService],
})
export class DocTeachModule {}
