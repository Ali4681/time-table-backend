import { Module } from '@nestjs/common';
import { TheoreticalService } from './theoretical.service';
import { TheoreticalController } from './theoretical.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TheoreticalType, TheoreticalTypeSchema } from './theoretical.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TheoreticalType.name, schema: TheoreticalTypeSchema },
    ]),
  ],
  controllers: [TheoreticalController],
  providers: [TheoreticalService],
})
export class TheoreticalModule {}
