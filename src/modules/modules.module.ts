import { Module } from '@nestjs/common';
import { ModuleService } from './modules.service';
import { ModuleController } from './modules.controller';
import { ModulesType, ModulesTypeSchema } from './modules.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentModuleType, StudentModuleTypeSchema } from 'src/studentmodule/studentmodule.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModulesType.name, schema: ModulesTypeSchema },
      { name: StudentModuleType.name, schema: StudentModuleTypeSchema },
    ]),
  ],

  controllers: [ModuleController],
  providers: [ModuleService],
})
export class ModulesModule {}
