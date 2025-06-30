import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { RoomType, RoomTypeSchema } from './room.schema';
import { DaysType, DaysTypeSchema } from '../days/days.schema';
import { HoursType, HoursTypeSchema } from '../hours/hours.schema';
import {
  ModulesType,
  ModulesTypeSchema,
} from '../modules/modules.schema';
import {
  DocTeachType,
  DocTeachTypeSchema,
} from '../docteach/docteach.schema';
import {
  StudentType,
  StudentTypeSchema,
} from '../student/student.schema';
import { DocHourSchema, DocHourType } from 'src/docteach/doc-hour.schema';
import { StudentModuleType, StudentModuleTypeSchema } from 'src/studentmodule/studentmodule.schema';
import { ModulesModule } from '../modules/modules.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RoomType.name, schema: RoomTypeSchema },
      { name: DaysType.name, schema: DaysTypeSchema },
      { name: HoursType.name, schema: HoursTypeSchema },
      { name: ModulesType.name, schema: ModulesTypeSchema },
      { name: DocTeachType.name, schema: DocTeachTypeSchema },
      { name: StudentType.name, schema: StudentTypeSchema },
      { name: DocHourType.name, schema: DocHourSchema },
      { name: StudentModuleType.name, schema: StudentModuleTypeSchema },
    ]),
    ModulesModule, // Import ModulesModule to access ModuleService
  ],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule { }
