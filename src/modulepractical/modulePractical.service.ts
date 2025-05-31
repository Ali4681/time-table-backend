import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ModulePractical } from './modulePractical.schema'; // Adjust the import path as needed
import { ModulePracticalDto } from './dto/modulePractical.dto';

@Injectable()
export class ModulePracticalService {
  constructor(
    @InjectModel(ModulePractical.name)
    private readonly modulePracticalModel: Model<ModulePractical>,
  ) {}

  // Create a new module-practical relationship
  async create(createModulePracticalDto: ModulePracticalDto) {
    const createdModulePractical = new this.modulePracticalModel({
      module: new Types.ObjectId(createModulePracticalDto.module),
      practical: new Types.ObjectId(createModulePracticalDto.practical),
    });
    return createdModulePractical.save();
  }

  // Find all module-practical relationships
  async findAll(){
    return this.modulePracticalModel
      .find()
      .populate('practical')
      .populate('module')
      .exec();
  }

  async remove(id: string){
    return this.modulePracticalModel.findByIdAndDelete(id).exec();
  }


  async findByPracticalId(practical: string) {
    return this.modulePracticalModel
      .find({ practical: new Types.ObjectId(practical) })
      .populate('practical')
      .populate('module')
      .exec();
  }


  async findByModuleTypeId(moduleTypeId: string): Promise<ModulePractical[]> {
    return this.modulePracticalModel
      .find({ module: new Types.ObjectId(moduleTypeId) })
      .populate('practical')
      .populate('module')
      .exec();
  }

  // Find a specific module-practical relationship by both IDs
  async findByBothIds(
    practicalId: string,
    moduleId: string,
  ): Promise<ModulePractical | null> {
    return this.modulePracticalModel
      .findOne({
        practical: new Types.ObjectId(practicalId),
        module: new Types.ObjectId(moduleId),
      })
      .populate('practical')
      .populate('module')
      .exec();
  }
}
