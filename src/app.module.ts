// app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocTeachModule } from './docteach/docteach.module';
import { HoursModule } from './hours/hours.module';
import { PracticalModule } from './practical/practical.module';
import { RoomModule } from './room/room.module';
import { StudentModule } from './student/student.module';
import { TheoreticalModule } from './theoretical/theoretical.module';
import { ModulesModule } from './modules/modules.module';
import { DaysModule } from './days/days.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://ali468:aaa123aaa@cluster0.dsejjf7.mongodb.net/time-table-database',
    ),
    UserModule,
    AuthModule,
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
