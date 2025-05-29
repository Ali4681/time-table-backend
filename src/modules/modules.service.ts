import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ModulesType } from './modules.schema';
import {
  StudentModuleType} from 'src/studentmodule/studentmodule.schema';
import { ModuleDto } from './Dto/modules.dto';
import { StudentModuleTypeService } from 'src/studentmodule/studentmodule.service';

@Injectable()
export class ModuleService {
  constructor(
    @InjectModel(ModulesType.name)
    private readonly moduleModel: Model<ModulesType>,
    @InjectModel(StudentModuleType.name)
    private readonly studentmoduleModel: Model<StudentModuleType>,
    private readonly studentModuleService: StudentModuleTypeService,
  ) {}

  async create(data: ModuleDto) {
    return this.moduleModel.create(data);
  }

  async findAll() {
    return this.moduleModel.find();
  }
  /////
  async getStudentsByModule(moduleId: string) {
    // return this.studentmoduleModel
    //   .find({ module: objectId })
    //   .populate('student') // يعيد بيانات الطالب كاملة
    //   .populate('module') // إذا كنت تحتاج بيانات المادة
    //   .exec();

    return this.studentModuleService.findByModule(moduleId);
  }

  findAllmoduleandpractica(id: string) {
    return this.studentModuleService.findAllmoduleandpractica(id);
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
  async findModuleWithDoctorATeacher(id: string) {
    const module = await this.moduleModel
      .findById(id) 
      .populate('doctorsId teacherId')
      .exec(); 

    if (!module) {
      throw new Error('Module not found'); // Handle case where module doesn't exist
    }

    return {
      module: {
        module_id: module._id,
        doctor: module.doctorsId,
        teacher: module.teacherId,
      },
    };
  }
}
