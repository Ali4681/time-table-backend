import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ModulesType } from './modules.schema';
import { StudentModuleType } from 'src/studentmodule/studentmodule.schema';
import { ModuleDto } from './Dto/modules.dto';
import { StudentModuleTypeService } from 'src/studentmodule/studentmodule.service';

interface ModuleData {
  module_id: string;
  module_code: string;
  module_name: string;
  teacher_id: string;
  teacher_name: string;
  doctor_id: string;
  doctor_name: string;
  type: string;
  enrollment: number;
  year_groups: number[];
  theoretical_sessions: number;
  practical_sessions_per_theoretical: number;
  branch_type?: string;
  parent_module?: string;
  branch_number?: number;
  theoretical_branch_number?: number;
}

interface StudentData {
  student_id: string;
  year_group: number;
  enrolled_modules: string[];
  student_name: string;
}

interface BranchInfo {
  name: string;
  type: string;
  enrollment: number;
}

interface SplittingDetail {
  originalModule: string;
  originalEnrollment: number;
  theoreticalBranches: number;
  practicalBranches: number;
  createdBranches: BranchInfo[];
}

interface SplittingReport {
  totalModulesSplit: number;
  theoreticalBranches: number;
  practicalBranches: number;
  details: SplittingDetail[];
}

@Injectable()
export class ModuleService {
  constructor(
    @InjectModel(ModulesType.name)
    private readonly moduleModel: Model<ModulesType>,
    @InjectModel(StudentModuleType.name)
    private readonly studentmoduleModel: Model<StudentModuleType>,
    private readonly studentModuleService: StudentModuleTypeService,
  ) { }

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
  async findByCode(code: string) {
    return this.moduleModel.findOne({ code: code });
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

  /**
   * Split modules based on capacity constraints
   * Theoretical: max 50 students per branch (C1, C2, C3...)
   * Practical: max 20 students per branch (C11, C12, C13...)
   */
  async splitModulesByCapacity(modules: ModuleData[], students: StudentData[]) {
    const splitModules: ModuleData[] = [];
    const splittingReport: SplittingReport = {
      totalModulesSplit: 0,
      theoreticalBranches: 0,
      practicalBranches: 0,
      details: []
    };

    for (const module of modules) {
      const enrolledStudents = students.filter(student =>
        student.enrolled_modules.includes(module.module_name)
      );

      const enrollment = module.enrollment || 0;
      const theoreticalSessions = module.theoretical_sessions || 0;
      const practicalSessions = module.practical_sessions_per_theoretical || 0;

      // Calculate required branches
      const THEORETICAL_CAPACITY = 50;
      const PRACTICAL_CAPACITY = 20;

      const theoreticalBranches = theoreticalSessions > 0 ?
        Math.ceil(enrollment / THEORETICAL_CAPACITY) : 0;
      const practicalBranches = practicalSessions > 0 ?
        Math.ceil(enrollment / PRACTICAL_CAPACITY) : 0;

      // Always apply branch naming for consistency (at minimum C1)
      const actualTheoreticalBranches = Math.max(theoreticalBranches, theoreticalSessions > 0 ? 1 : 0);
      const actualPracticalBranches = Math.max(practicalBranches, practicalSessions > 0 ? 1 : 0);

      // Update splitting report only if actual splitting occurred
      if (theoreticalBranches > 1 || practicalBranches > 1) {
        splittingReport.totalModulesSplit++;
      }

      const moduleDetails: SplittingDetail = {
        originalModule: module.module_name,
        originalEnrollment: enrollment,
        theoreticalBranches: actualTheoreticalBranches,
        practicalBranches: actualPracticalBranches,
        createdBranches: []
      };

      // Create theoretical branches (always at least C1 if has theoretical sessions)
      if (theoreticalSessions > 0) {
        for (let i = 1; i <= actualTheoreticalBranches; i++) {
          const branchCode = `${module.module_code}_C${i}`;
          const branchName = `${module.module_name}_C${i}`;

          // Calculate students for this branch
          const startIndex = (i - 1) * THEORETICAL_CAPACITY;
          const endIndex = Math.min(i * THEORETICAL_CAPACITY, enrollment);
          const branchEnrollment = endIndex - startIndex;

          const theoreticalBranch: ModuleData = {
            ...module,
            module_id: branchName,
            module_code: branchCode,
            module_name: branchName,
            enrollment: branchEnrollment,
            theoretical_sessions: theoreticalSessions,
            practical_sessions_per_theoretical: 0, // Only theoretical
            branch_type: 'theoretical',
            parent_module: module.module_name,
            branch_number: i
          };

          splitModules.push(theoreticalBranch);
          splittingReport.theoreticalBranches++;

          moduleDetails.createdBranches.push({
            name: branchName,
            type: 'theoretical',
            enrollment: branchEnrollment
          });
        }
      }

      // Create practical branches grouped by theoretical branches
      if (practicalSessions > 0) {
        let practicalBranchCounter = 1;

        // For each theoretical branch, create its practical branches
        for (let theoreticalBranch = 1; theoreticalBranch <= actualTheoreticalBranches; theoreticalBranch++) {
          // Calculate students in this theoretical branch
          const theoreticalStartIndex = (theoreticalBranch - 1) * THEORETICAL_CAPACITY;
          const theoreticalEndIndex = Math.min(theoreticalBranch * THEORETICAL_CAPACITY, enrollment);
          const studentsInTheoreticalBranch = theoreticalEndIndex - theoreticalStartIndex;

          // Calculate how many practical branches needed for this theoretical branch
          const practicalBranchesForThisTheoretical = Math.ceil(studentsInTheoreticalBranch / PRACTICAL_CAPACITY);

          // Create practical branches for this theoretical branch
          for (let practicalWithinTheoretical = 1; practicalWithinTheoretical <= practicalBranchesForThisTheoretical; practicalWithinTheoretical++) {
            const branchCode = `${module.module_code}_C${theoreticalBranch}${practicalWithinTheoretical}`;
            const branchName = `${module.module_name}_C${theoreticalBranch}${practicalWithinTheoretical}`;

            // Calculate students for this practical branch
            const practicalStartIndex = theoreticalStartIndex + (practicalWithinTheoretical - 1) * PRACTICAL_CAPACITY;
            const practicalEndIndex = Math.min(practicalStartIndex + PRACTICAL_CAPACITY, theoreticalEndIndex);
            const branchEnrollment = practicalEndIndex - practicalStartIndex;

            const practicalBranch: ModuleData = {
              ...module,
              module_id: branchName,
              module_code: branchCode,
              module_name: branchName,
              enrollment: branchEnrollment,
              theoretical_sessions: 0, // Only practical
              practical_sessions_per_theoretical: practicalSessions,
              branch_type: 'practical',
              parent_module: module.module_name,
              branch_number: practicalBranchCounter,
              theoretical_branch_number: theoreticalBranch
            };

            splitModules.push(practicalBranch);
            splittingReport.practicalBranches++;

            moduleDetails.createdBranches.push({
              name: branchName,
              type: 'practical',
              enrollment: branchEnrollment
            });

            practicalBranchCounter++;
          }
        }
      }
      splittingReport.details.push(moduleDetails);
    }

    console.log(`📊 Module Processing Report:
    - Total modules processed: ${modules.length}
    - Modules requiring splitting: ${splittingReport.totalModulesSplit}
    - Theoretical branches created: ${splittingReport.theoreticalBranches}
    - Practical branches created: ${splittingReport.practicalBranches}
    - Final module count: ${splitModules.length}
    - All modules normalized with C1+ naming`);

    return {
      splitModules,
      splittingReport
    };
  }

  /**
   * Update student enrollments to match split modules
   */
  updateStudentEnrollmentsForSplitModules(students: StudentData[], splitModules: ModuleData[], splittingReport: SplittingReport): StudentData[] {
    const updatedStudents = students.map(student => {
      const updatedEnrolledModules: string[] = [];

      for (const moduleName of student.enrolled_modules) {
        // Find if this module was split
        const splitDetails = splittingReport.details.find(detail =>
          detail.originalModule === moduleName
        );

        if (!splitDetails) {
          // Module wasn't processed (shouldn't happen), keep original
          updatedEnrolledModules.push(moduleName);
          continue;
        }

        // Module was split - assign student to appropriate branches
        const studentIndex = students.findIndex(s => s.student_id === student.student_id);

        // Assign to theoretical branch
        if (splitDetails.theoreticalBranches > 0) {
          const branchIndex = Math.floor(studentIndex / 50) + 1;
          const branchName = `${moduleName}_C${Math.min(branchIndex, splitDetails.theoreticalBranches)}`;
          updatedEnrolledModules.push(branchName);
        }

        // Assign to practical branch
        if (splitDetails.practicalBranches > 0) {
          // Determine which theoretical branch this student belongs to
          const theoreticalBranchNumber = Math.floor(studentIndex / 50) + 1;

          // Calculate position within the theoretical branch
          const positionInTheoretical = studentIndex % 50;

          // Calculate which practical branch within the theoretical branch
          const practicalWithinTheoretical = Math.floor(positionInTheoretical / 20) + 1;

          const branchName = `${moduleName}_C${theoreticalBranchNumber}${practicalWithinTheoretical}`;
          updatedEnrolledModules.push(branchName);
        }
      }

      return {
        ...student,
        enrolled_modules: updatedEnrolledModules
      };
    });

    return updatedStudents;
  }
}
