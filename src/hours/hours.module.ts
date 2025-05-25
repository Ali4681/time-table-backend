import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HoursService } from './hours.service';
import { HoursController } from './hours.controller';
import { HoursType, HoursTypeSchema } from './hours.schema';
import { DaysType, DaysTypeSchema } from 'src/days/days.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HoursType.name, schema: HoursTypeSchema },
      { name: DaysType.name, schema: DaysTypeSchema },
    ]),
  ],
  controllers: [HoursController],
  providers: [HoursService],
})
export class HoursModule {}
