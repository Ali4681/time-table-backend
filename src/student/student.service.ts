import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { StudentType } from './student.schema';
import { StudentModuleTypeService } from '../studentmodule/studentmodule.service';
import { StudentDto } from './Dto/student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(StudentType.name)
    private readonly studentModel: Model<StudentType>,
    private readonly studentModuleService: StudentModuleTypeService,
  ) {}

  async findAll() {
    return this.studentModel.find();
  }

  async findById(id: string) {
    return this.studentModel.findById(id);
  }

  async create(data: StudentDto) {
    return this.studentModel.create(data);
  }

  async update(id: string, data: StudentDto) {
    return this.studentModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string) {
    return this.studentModel.findByIdAndDelete(id);
  }

  // ✅ تسجيل الطالب في مادة
  async registerToModule(student: string, module: string, practical: string) {
    return this.studentModuleService.create({
      student: new Types.ObjectId(student),
      module: new Types.ObjectId(module),
      Practical: new Types.ObjectId(practical),
    });
  }

  // ✅ إظهار المواد التي سجلها الطالب
  async getModulesForStudent(student: string) {
    return this.studentModuleService.findByStudent(student);
  }

  // ✅ إلغاء تسجيل الطالب من مادة
  async unregisterFromModule(studentId: string, moduleId: string) {
    return this.studentModuleService.deleteByStudentAndModule(
      studentId,
      moduleId,
    );
  }
}
