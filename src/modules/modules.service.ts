import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ModulesType } from './modules.schema';
import { StudentModuleType } from 'src/studentmodule/studentmodule.schema';
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
    const create = new this.moduleModel({
      name: data.name,
      code: data.code,
      doctorsId: new Types.ObjectId(data.doctors), // ✔️ String واحد
      hours: data.hours,
      teacherId: new Types.ObjectId(data.teacher), // ✔️ String واحد
      years: data.years, // ✔️ Array of numbers (مثل [1, 2, 3])
      erolledStudents: data.erolledStudents,
    });
    const module2 = await create.save();

    // populate doctorsId and teacherId with DocTeachType
    const module = await this.moduleModel
      .findById(module2._id)
      .populate('doctorsId teacherId');
    return module;
  }

  async findAll() {
    return this.moduleModel.find().populate('doctorsId teacherId');
  }
  /////
  async getStudentsByModule(moduleId: string) {
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
    return this.moduleModel
      .findByIdAndUpdate(id, data, { new: true })
      .populate('doctorsId teacherId')
      .lean()
      .exec();
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
