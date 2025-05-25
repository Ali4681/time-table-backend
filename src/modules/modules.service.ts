import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ModulesType } from './modules.schema';
import {
  StudentModuleType} from 'src/studentmodule/studentmodule.schema';
import { ModuleDto } from './Dto/modules.dto';

@Injectable()
export class ModuleService {
  constructor(
    @InjectModel(ModulesType.name)
    private readonly moduleModel: Model<ModulesType>,
    @InjectModel(StudentModuleType.name)
    private readonly studentmoduleModel: Model<StudentModuleType>,
  ) {}

  async create(data: ModuleDto) {
    return this.moduleModel.create(data);
  }

  async findAll() {
    return this.moduleModel.find();
  }
  /////
  async getStudentsByModule(moduleId: string) {
    const objectId = new Types.ObjectId(moduleId);
    return this.studentmoduleModel
      .find({ module: objectId })
      .populate('student') // يعيد بيانات الطالب كاملة
      .populate('module') // إذا كنت تحتاج بيانات المادة
      .exec();
  }

  /////

  async findById(id: string) {
    return this.moduleModel.findById(id);
  }

  async update(id: string, data: ModuleDto) {
    return this.moduleModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    return this.moduleModel.findByIdAndDelete(id);
  }
}
