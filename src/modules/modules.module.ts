// modules.module.ts
import { Module } from '@nestjs/common';
import { ModuleService } from './modules.service';
import { ModuleController } from './modules.controller';
import { ModulesType, ModulesTypeSchema } from './modules.schema';
import { MongooseModule } from '@nestjs/mongoose';
import {
  StudentModuleType,
  StudentModuleTypeSchema,
} from '../studentmodule/studentmodule.schema';
import { StudentModuleTypeModule } from '../studentmodule/studentmodule.module';
import { LinkToRoomModule } from './linkToRoom.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModulesType.name, schema: ModulesTypeSchema },
      { name: StudentModuleType.name, schema: StudentModuleTypeSchema },
    ]),
    StudentModuleTypeModule,
    LinkToRoomModule, // Add this line to import the module
  ],
  controllers: [ModuleController],
  providers: [ModuleService],
})
export class ModulesModule {}
