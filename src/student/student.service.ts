import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { StudentType } from './student.schema';
import { StudentModuleTypeService } from '../studentmodule/studentmodule.service';
import { StudentDto } from './Dto/student.dto';
import { StudentModuleType } from 'src/studentmodule/studentmodule.schema';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(StudentType.name)
    private readonly studentModel: Model<StudentType>,
    @InjectModel(StudentModuleType.name)
    private readonly studentModuleModel: Model<StudentModuleType>,
    private readonly studentModuleService: StudentModuleTypeService,
  ) {}
  async findAll() {
    const students = await this.studentModel.find().lean();

    const studentModules = await this.studentModuleModel
      .find()
      .populate('student module')
      .lean();

    const modulesMap = new Map<string, any[]>();

    for (const mod of studentModules) {
      // اعتبر student كـ any لتفادي مشكلة TS
      const student = mod.student as any;

      // تحقق من أن student موجود وله _id قبل الاستخدام
      if (!student || !student._id) continue;

      const studentId = student._id.toString();

      // إزالة حقل student لتفادي التكرار
      const { student: _student, ...moduleWithoutStudent } = mod;

      if (!modulesMap.has(studentId)) {
        modulesMap.set(studentId, []);
      }

      modulesMap.get(studentId)?.push(moduleWithoutStudent);
    }

    return students.map((student) => {
      const studentId = student._id.toString();
      return {
        ...student,
        modules: modulesMap.get(studentId) || [],
      };
    });
  }

  async findById(id: string) {
    return this.studentModel.findById(id);
  }

  async create(data: StudentDto) {
    const { modules, ...studentData } = data;

    const student = new this.studentModel(studentData);
    await student.save();

    const studentId = new Types.ObjectId(student._id + '');

    const modulePromises = modules.map((moduleId) => {
      if (!Types.ObjectId.isValid(moduleId)) {
        throw new Error(`Invalid moduleId: ${moduleId}`);
      }

      return this.studentModuleService.create({
        student: studentId,
        module: new Types.ObjectId(moduleId),
        // Uncomment only if you have a valid practicalId
        // Practical: practicalId ? new Types.ObjectId(practicalId) : undefined,
      });
    });

    await Promise.all(modulePromises);
    return student;
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
