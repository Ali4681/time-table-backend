import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DaysService } from './days.service';
import { DaysController } from './days.controller';
import { DaysType, DaysTypeSchema } from './days.schema';
import { HoursType, HoursTypeSchema } from 'src/hours/hours.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DaysType.name, schema: DaysTypeSchema },
      { name: HoursType.name, schema: HoursTypeSchema },
    ]),
  ],
  controllers: [DaysController],
  providers: [DaysService],
})
export class DaysModule {}
