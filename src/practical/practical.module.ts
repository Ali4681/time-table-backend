import { Module } from '@nestjs/common';
import { PracticalService } from './practical.service';
import { PracticalController } from './practical.controller';

@Module({
  controllers: [PracticalController],
  providers: [PracticalService],
})
export class PracticalModule {}
