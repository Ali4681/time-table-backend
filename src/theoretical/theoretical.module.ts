import { Module } from '@nestjs/common';
import { TheoreticalService } from './theoretical.service';
import { TheoreticalController } from './theoretical.controller';

@Module({
  controllers: [TheoreticalController],
  providers: [TheoreticalService],
})
export class TheoreticalModule {}
