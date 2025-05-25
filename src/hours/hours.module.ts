import { Module } from '@nestjs/common';
import { HoursService } from './hours.service';
import { HoursController } from './hours.controller';

@Module({
  controllers: [HoursController],
  providers: [HoursService],
})
export class HoursModule {}
