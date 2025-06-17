import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentType, StudentTypeSchema } from './student.schema';
import {
  StudentModuleType,
  StudentModuleTypeSchema,
} from 'src/studentmodule/studentmodule.schema';
import { StudentModuleTypeModule } from 'src/studentmodule/studentmodule.module';
import { StudentModuleTypeService } from 'src/studentmodule/studentmodule.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StudentType.name, schema: StudentTypeSchema },
      { name: StudentModuleType.name, schema: StudentModuleTypeSchema },
    ]),
    StudentModuleTypeModule,
  ],
  controllers: [StudentController],
  providers: [StudentService,StudentModuleTypeService],
})
export class StudentModule {}
