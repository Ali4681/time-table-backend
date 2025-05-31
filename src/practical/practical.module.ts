import { Module } from '@nestjs/common';
import { PracticalService } from './practical.service';
import { PracticalController } from './practical.controller';
import { PracticalType, PracticalTypeSchema } from './practical.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { TheoreticalType, TheoreticalTypeSchema } from 'src/theoretical/theoretical.schema';
import { ModulePractical, ModulePracticalSchema } from 'src/modulepractical/modulePractical.schema';
import { ModulePracticalModule } from 'src/modulepractical/modulePractical.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PracticalType.name, schema: PracticalTypeSchema },
      { name: TheoreticalType.name, schema: TheoreticalTypeSchema },
      { name: ModulePractical.name, schema: ModulePracticalSchema },
    ]),
    ModulePracticalModule,
  ],
  controllers: [PracticalController],
  providers: [PracticalService],
})
export class PracticalModule {}
