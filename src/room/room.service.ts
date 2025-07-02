// room.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';
import { DaysType } from 'src/days/days.schema';
import { DocHourType } from 'src/docteach/doc-hour.schema';
import { DocTeachType } from 'src/docteach/docteach.schema';
import { HoursType } from 'src/hours/hours.schema';
import { ModulesType } from 'src/modules/modules.schema';
import { StudentType } from 'src/student/student.schema';
import { StudentModuleType } from 'src/studentmodule/studentmodule.schema';
import { ModuleService } from '../modules/modules.service';
import { RoomDto } from './dto/room.dto';
import { RoomType } from './room.schema';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(RoomType.name) private roomModel: Model<RoomType>,
    @InjectModel(DaysType.name) private daysModel: Model<DaysType>,
    @InjectModel(HoursType.name) private hourModel: Model<HoursType>,
    @InjectModel(ModulesType.name) private moduleModel: Model<ModulesType>,
    @InjectModel(DocTeachType.name) private docTeachModel: Model<DocTeachType>,
    @InjectModel(StudentType.name) private studentModel: Model<StudentType>,
    @InjectModel(DocHourType.name) private DocHourModel: Model<DocHourType>,
    @InjectModel(StudentModuleType.name)
    private studentModuleModel: Model<StudentModuleType>,
    private moduleService: ModuleService,
  ) {}

  async create(createRoomDto: RoomDto): Promise<RoomType> {
    const newRoom = new this.roomModel(createRoomDto);
    const savedRoom = await newRoom.save();
    return savedRoom.toObject(); // Convert to plain object
  }

  async findAll(): Promise<RoomType[]> {
    return this.roomModel.find().lean().exec(); // Add .lean()
  }

  async findOne(id: string): Promise<RoomType> {
    const room = await this.roomModel.findById(id).lean().exec(); // Add .lean()
    if (!room) throw new NotFoundException('Room not found');
    return room;
  }

  async update(id: string, updateRoomDto: RoomDto): Promise<RoomType> {
    const room = await this.roomModel
      .findByIdAndUpdate(id, updateRoomDto, { new: true })
      .lean() // Add .lean()
      .exec();
    if (!room) throw new NotFoundException('Room not found');
    return room;
  }

  async remove(id: string): Promise<void> {
    const result = await this.roomModel.findByIdAndDelete(id).lean().exec();
    if (!result) throw new NotFoundException('Room not found');
  }

  async infogenerate() {
    try {
      // 1. Get all necessary data from database
      const days = await this.daysModel.find().lean().exec();
      const hours = await this.hourModel.find().lean().exec();
      const modules = await this.moduleModel.find().lean().exec();
      const rooms = await this.roomModel.find().lean().exec();
      const teachers = await this.docTeachModel.find().lean().exec();
      const students = await this.studentModel.find().lean().exec();

      // 2. Prepare schedule parameters
      const scheduleParameters = {
        days: days.map((d) => d.name),
        time_slots: [...new Set(hours.map((h) => h.value))],
        practical_sessions_per_theoretical: 1,
      };

      // 3. Prepare rooms data (ensure unique room IDs)
      const roomList = rooms.map((room) => ({
        room_id: room._id.toString(),
        room_name: room.name,
        capacity: room.capacity,
        type: room.theoretical ? 'theoretical' : 'lab',
      }));

      // 4. Prepare teachers data with unique IDs and availability
      const uniqueTeachers = new Map<string, any>();
      await Promise.all(
        teachers.map(async (teacher) => {
          // Skip if teacher already processed
          if (uniqueTeachers.has(teacher.name)) {
            return;
          }

          const docHours = await this.DocHourModel.find({ docId: teacher._id })
            .lean()
            .exec();

          // Initialize availability structure
          const availability = {};
          scheduleParameters.days.forEach((day) => {
            availability[day] = {};
            scheduleParameters.time_slots.forEach((slot) => {
              availability[day][slot] = false;
            });
          });

          // Set available slots
          for (const docHour of docHours) {
            const hour = await this.hourModel
              .findById(docHour.hourId)
              .lean()
              .exec();
            if (!hour) continue;

            const day = await this.daysModel
              .findById(hour.daysId)
              .lean()
              .exec();
            if (!day) continue;

            const dayName = day.name;
            const timeSlot = hour.value;

            if (
              availability[dayName] &&
              availability[dayName][timeSlot] !== undefined
            ) {
              availability[dayName][timeSlot] = true;
            }
          }

          uniqueTeachers.set(teacher.name, {
            teacher_id: teacher._id.toString(),
            teacher_name: teacher.name,
            availability,
          });
        }),
      );

      // Convert Map to array
      const teacherList = Array.from(uniqueTeachers.values());

      // 5. Prepare students data
      const studentList = await Promise.all(
        students.map(async (student) => {
          const yearModules = modules.filter((m) =>
            m.years.includes(parseInt(student.years)),
          );

          return {
            student_id: student._id.toString(),
            year_group: parseInt(student.years),
            enrolled_modules: yearModules.map((m) => m.name),
            student_name: student.name,
          };
        }),
      );

      // 6. Prepare modules data with names and unique teacher references
      const moduleList = modules.map((module) => {
        const doctors = teachers.find(
          (t) => t._id.toString() === module.doctorsId.toString(),
        );
        const doctorName = doctors ? doctors.name : 'Unknown';

        const teacher = teachers.find(
          (t) => t._id.toString() === module.teacherId.toString(),
        );
        const teacherName = teacher ? teacher.name : 'Unknown';

        console.log('module enrolled studetns : ', module.erolledStudents || 0);

        return {
          module_id: module.name, // Internal reference
          module_code: module.code,
          module_name: module.name, // Module name for display
          teacher_id: teacher ? teacher._id.toString() : 'unknown',
          teacher_name: teacherName,
          doctor_id: doctors ? doctors._id.toString() : 'unknown',
          doctor_name: doctorName,
          type: module.years.length > 1 ? 'elective' : 'core',
          enrollment: module.erolledStudents || 0,
          year_groups: module.years || [],
          theoretical_sessions: Math.ceil(module.hours / 2) || 2,
          practical_sessions_per_theoretical: module.hours > 2 ? 1 : 0,
        };
      });

      // 7. Apply module splitting based on capacity constraints
      console.log('🔧 Starting module splitting preprocessing...');
      const { splitModules, splittingReport } =
        await this.moduleService.splitModulesByCapacity(
          moduleList,
          studentList,
        );

      // 8. Update student enrollments to match split modules
      const updatedStudents =
        this.moduleService.updateStudentEnrollmentsForSplitModules(
          studentList,
          splitModules,
          splittingReport,
        );

      // 9. Combine all data into the final structure with split modules
      const scheduleData = {
        schedule_parameters: scheduleParameters,
        rooms: roomList,
        teachers: teacherList,
        students: studentList,
        modules: moduleList,
        // modules: splitModules,
        // optimizationMode: 'feasible',
        // splittingReport: splittingReport,
      };

      console.log(`📊 Final data summary:
      - Original modules: ${moduleList.length}
      - Split modules: ${splitModules.length}
      - Students updated: ${updatedStudents.length}
      - Splitting report: ${splittingReport.totalModulesSplit} modules split`);

      // 10. Make API call to Enhanced Production Flask solver
      const response = await axios.post(
        'http://localhost:5000/schedule',
        scheduleData,
      );

      return {
        success: true,
        data: response.data,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (error) {
      console.error('Error sending data to scheduling service:', error);

      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.message,
          status: error.response?.status || 500,
          data: error.response?.data || null,
        };
      }

      throw error;
    }
  }

  async infogenerateTest(): Promise<any> {
    try {
      // 1. Get all necessary data from database
      const days = await this.daysModel.find().lean().exec();
      const hours = await this.hourModel.find().lean().exec();
      const modules = await this.moduleModel.find().lean().exec();
      const rooms = await this.roomModel.find().lean().exec();
      const teachers = await this.docTeachModel.find().lean().exec();
      const students = await this.studentModel.find().lean().exec();

      // 2. Prepare schedule parameters
      const scheduleParameters = {
        days: days.map((d) => d.name),
        time_slots: [...new Set(hours.map((h) => h.value))],
        practical_sessions_per_theoretical: 1,
      };

      // 3. Prepare rooms data (ensure unique room IDs)
      const roomList = rooms.map((room) => ({
        room_id: room._id.toString(),
        room_name: room.name,
        capacity: room.capacity,
        type: room.theoretical ? 'theoretical' : 'lab',
      }));

      // 4. Prepare teachers data with unique IDs and availability
      const uniqueTeachers = new Map<string, any>();
      await Promise.all(
        teachers.map(async (teacher) => {
          // Skip if teacher already processed
          if (uniqueTeachers.has(teacher.name)) {
            return;
          }

          const docHours = await this.DocHourModel.find({ docId: teacher._id })
            .lean()
            .exec();

          // Initialize availability structure
          const availability = {};
          scheduleParameters.days.forEach((day) => {
            availability[day] = {};
            scheduleParameters.time_slots.forEach((slot) => {
              availability[day][slot] = false;
            });
          });

          // Set available slots
          for (const docHour of docHours) {
            const hour = await this.hourModel
              .findById(docHour.hourId)
              .lean()
              .exec();
            if (!hour) continue;

            const day = await this.daysModel
              .findById(hour.daysId)
              .lean()
              .exec();
            if (!day) continue;

            const dayName = day.name;
            const timeSlot = hour.value;

            if (
              availability[dayName] &&
              availability[dayName][timeSlot] !== undefined
            ) {
              availability[dayName][timeSlot] = true;
            }
          }

          uniqueTeachers.set(teacher.name, {
            teacher_name: teacher.name,
            availability,
          });
        }),
      );

      // Convert Map to array
      const teacherList = Array.from(uniqueTeachers.values());

      // 5. Prepare students data
      const studentList = await Promise.all(
        students.map(async (student) => {
          const yearModules = modules.filter((m) =>
            m.years.includes(parseInt(student.years)),
          );

          return {
            student_id: student._id.toString(),
            year_group: parseInt(student.years),
            enrolled_modules: yearModules.map((m) => m.name),
            student_name: student.name,
          };
        }),
      );

      // 6. Prepare modules data with names and unique teacher references
      const moduleList = modules.map((module) => {
        const doctors = teachers.find(
          (t) => t._id.toString() === module.doctorsId.toString(),
        );
        const doctorName = doctors ? doctors.name : 'Unknown';

        const teacher = teachers.find(
          (t) => t._id.toString() === module.teacherId.toString(),
        );
        const teacherName = teacher ? teacher.name : 'Unknown';

        return {
          module_id: module.name, // Internal reference
          module_code: module.code,
          module_name: module.name, // Module name for display
          teacher_name: teacherName,
          doctor_name: doctorName,
          type: module.years.length > 1 ? 'elective' : 'core',
          enrollment: module.erolledStudents || 0,
          year_groups: module.years || [],
          theoretical_sessions: Math.ceil(module.hours / 2) || 2,
          practical_sessions_per_theoretical: module.hours > 2 ? 1 : 0,
        };
      });

      // 7. Apply module splitting based on capacity constraints
      console.log('🔧 Starting module splitting preprocessing...');
      // const { splitModules, splittingReport } = await this.moduleService.splitModulesByCapacity(
      //   moduleList,
      //   studentList
      // );

      // 9. Combine all data into the final structure with split modules
      const scheduleData = {
        schedule_parameters: scheduleParameters,
        rooms: roomList,
        teachers: teacherList,
        students: studentList,
        modules: moduleList.map((item) => {
          const {
            type,
            theoretical_sessions,
            practical_sessions_per_theoretical,
            ...rest
          } = item;
          return rest;
        }),
        // optimizationMode: 'feasible',
        // splittingReport: splittingReport,
      };

      return scheduleData;
    } catch (error) {
      console.error('Error sending data to scheduling service:', error);
      throw error;
    }
  }
}
