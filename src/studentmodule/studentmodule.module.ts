import { Module } from '@nestjs/common';
import { StudentModuleTypeService } from './studentmodule.service';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentModuleType, StudentModuleTypeSchema } from './studentmodule.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StudentModuleType.name, schema: StudentModuleTypeSchema },
    ]),
  ],
  providers: [StudentModuleTypeService],
  exports: [StudentModuleTypeService],
})
export class StudentModuleTypeModule {}
