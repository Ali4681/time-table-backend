import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { StudentModuleType } from './studentmodule.schema';

@Injectable()
export class StudentModuleTypeService {
  constructor(
    @InjectModel(StudentModuleType.name)
    private readonly model: Model<StudentModuleType>,
  ) {}

  async create(data: {
    student: Types.ObjectId;
    module: Types.ObjectId;
    Practical?: Types.ObjectId;
  }) {
    const existing = await this.model.findOne({
      student: data.student,
      module: data.module,
    });

    if (existing) {
      throw new Error('Student is already registered in this module');
    }

    return this.model.create({
      ...data,
      registrationDate: new Date(),
    });
  }

  async findAllmoduleandpractica(studentId: string) {
    const ObjectId = new Types.ObjectId(studentId);

    const array = await this.model
      .find({ student: ObjectId })
      .populate('student')
      .populate('Practical')
      .populate('module');

    return {
      moduleAndHisPractical: array,
    };
  }

  async findById(id: string) {
    return this.model
      .findById(id)
      .populate('student')
      .populate('Practical')
      .populate('module');
  }

  async update(id: string, data: Partial<StudentModuleType>) {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    return this.model.findByIdAndDelete(id);
  }

  async findByStudent(studentId: string) {
    const ObjectId = new Types.ObjectId(studentId);
    const registrations = await this.model
      .find({ student: ObjectId })
      .populate('module');

    // Transform the response
    if (registrations.length === 0) {
      return null;
    }

    return {
      student: studentId,
      modules: registrations.map((reg) => ({
        module: reg.module,
        registrationDate: reg.registrationDate,
        registrationId: reg._id,
      })),
    };
  }
  async findByModule(moduleId: string) {
    const ObjectId = new Types.ObjectId(moduleId);
    const registrations = await this.model
      .find({ module: ObjectId })
      .populate('student');

    // Transform the response
    if (registrations.length === 0) {
      return null;
    }

    return {
      module: moduleId,
      students: registrations.map((reg) => ({
        student: reg.student,
        registrationDate: reg.registrationDate,
        registrationId: reg._id,
      })),
    };
  }

  async deleteByStudentAndModule(studentId: string, moduleId: string) {
    return this.model.deleteOne({ student: studentId, module: moduleId });
  }
}
