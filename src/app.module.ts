import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocTeachModule } from './docteach/docteach.module';
import { HoursModule } from './hours/hours.module';
import { PracticalModule } from './practical/practical.module';
import { RoomModule } from './room/room.module';
import { StudentModule } from './student/student.module';
import { TheoreticalModule } from './theoretical/theoretical.module';
import { ModulesModule } from './modules/modules.module';
import { DaysModule } from './days/days.module';

@Module({
  imports: [
    DocTeachModule,
    HoursModule,
    ModulesModule,
    PracticalModule,
    RoomModule,
    StudentModule,
    TheoreticalModule,
    DaysModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
