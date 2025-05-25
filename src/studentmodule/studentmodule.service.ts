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
    practical?: Types.ObjectId;
  }) {
    return this.model.create({
      ...data,
      registrationDate: new Date(),
    });
  }

  async findAll() {
    return this.model.find().populate('student module practical');
  }

  async findById(id: string) {
    return this.model.findById(id).populate('student module practical');
  }

  async update(id: string, data: Partial<StudentModuleType>) {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    return this.model.findByIdAndDelete(id);
  }

  async findByStudent(studentId: string) {

    const ObjectId = new Types.ObjectId(studentId);

    return this.model.find({ student: ObjectId }).populate('module');
  }

  async deleteByStudentAndModule(studentId: string, moduleId: string) {
    return this.model.deleteOne({ student: studentId, module: moduleId });
  }
}
