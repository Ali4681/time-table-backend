import { Module } from '@nestjs/common';
import { PracticalService } from './practical.service';
import { PracticalController } from './practical.controller';
import { PracticalType, PracticalTypeSchema } from './practical.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { TheoreticalType, TheoreticalTypeSchema } from 'src/theoretical/theoretical.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PracticalType.name, schema: PracticalTypeSchema },
      { name: TheoreticalType.name, schema: TheoreticalTypeSchema },
    ]),
  ],
  controllers: [PracticalController],
  providers: [PracticalService],
})
export class PracticalModule {}
