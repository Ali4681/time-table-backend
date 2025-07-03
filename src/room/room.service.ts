// room.service.ts - Complete Updated Version
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
  ) { }

  async create(createRoomDto: RoomDto): Promise<RoomType> {
    const newRoom = new this.roomModel(createRoomDto);
    const savedRoom = await newRoom.save();
    return savedRoom.toObject();
  }

  async findAll(): Promise<RoomType[]> {
    return this.roomModel.find().lean().exec();
  }

  async findOne(id: string): Promise<RoomType> {
    const room = await this.roomModel.findById(id).lean().exec();
    if (!room) throw new NotFoundException('Room not found');
    return room;
  }

  async update(id: string, updateRoomDto: RoomDto): Promise<RoomType> {
    const room = await this.roomModel
      .findByIdAndUpdate(id, updateRoomDto, { new: true })
      .lean()
      .exec();
    if (!room) throw new NotFoundException('Room not found');
    return room;
  }

  async remove(id: string): Promise<void> {
    const result = await this.roomModel.findByIdAndDelete(id).lean().exec();
    if (!result) throw new NotFoundException('Room not found');
  }

  /**
   * 🎯 UNIVERSAL APPROACH: Every module gets both theoretical and practical sessions
   * 🔬 ENHANCED LAB DISTRIBUTION: Uses all available labs efficiently
   */
  async infogenerate() {
    try {
      console.log('🎯 Starting Universal Practical Session Generation...');
      console.log('🔬 Enhanced Lab Distribution enabled...');

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
        time_slots: [...new Set(hours.map((h) => h.value))],
        practical_sessions_per_theoretical: 1,
      };

      // 3. 🔬 Enhanced rooms data with lab specialization analysis
      const theoreticalRooms = rooms.filter(room => room.theoretical);
      const labRooms = rooms.filter(room => !room.theoretical);

      console.log(`🏢 Room Analysis:`);
      console.log(`   - Theoretical rooms: ${theoreticalRooms.length}`);
      console.log(`   - Lab rooms: ${labRooms.length}`);

      labRooms.forEach((lab, index) => {
        console.log(`   - Lab ${index + 1}: ${lab.name} (capacity: ${lab.capacity})`);
      });

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

      const teacherList = Array.from(uniqueTeachers.values());

      // 5. Prepare students data with graduation priority analysis
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

      // 6. 🎯 UNIVERSAL: Prepare modules - ALL modules get practical sessions
      const moduleList = modules.map((module) => {
        const doctors = teachers.find(
          (t) => t._id.toString() === module.doctorsId.toString(),
        );
        const doctorName = doctors ? doctors.name : 'Unknown';

        const teacher = teachers.find(
          (t) => t._id.toString() === module.teacherId.toString(),
        );
        const teacherName = teacher ? teacher.name : 'Unknown';

        const enrollment = module.erolledStudents || 0;
        const practicalSessionsExpected = enrollment > 0 ? Math.ceil(enrollment / 20) : 0;

        // 🔬 Determine lab specialization preference
        const moduleName = module.name.toLowerCase();
        let labPreference = 'general';

        if (moduleName.includes('اتصالات') || moduleName.includes('مقاسم') || moduleName.includes('هاتفية')) {
          labPreference = 'communications';
        } else if (moduleName.includes('الكترونيات') || moduleName.includes('دارات')) {
          labPreference = 'electronics';
        } else if (moduleName.includes('فيزياء')) {
          labPreference = 'physics';
        } else if (moduleName.includes('حاسوب') || moduleName.includes('برمجة') || moduleName.includes('نظم')) {
          labPreference = 'computer';
        } else if (moduleName.includes('شبكات')) {
          labPreference = 'networks';
        }

        console.log(`📝 Module: ${module.name}`);
        console.log(`   - Enrollment: ${enrollment}`);
        console.log(`   - Expected Practical Sessions: ${practicalSessionsExpected}`);
        console.log(`   - Lab Preference: ${labPreference}`);
        console.log(`   - Doctor: ${doctorName}`);
        console.log(`   - Teacher: ${teacherName}`);

        return {
          module_id: module.name,
          module_code: module.code,
          module_name: module.name,
          teacher_name: teacherName,
          doctor_name: doctorName,
          enrollment: enrollment,

          // 🎯 UNIVERSAL: Every module gets practical sessions
          needs_practical_sessions: true,
          practical_sessions_expected: practicalSessionsExpected,
          lab_preference: labPreference,

          // Additional metadata
          total_hours: module.hours || 2,
          year_groups: module.years || [],
          subject_type: 'universal'
        };
      });

      // 7. 🎯 Comprehensive analysis and logging
      const totalModules = moduleList.length;
      const modulesWithStudents = moduleList.filter(m => m.enrollment > 0);
      const totalPracticalSessions = moduleList.reduce((sum, m) => sum + m.practical_sessions_expected, 0);

      // Analyze lab preferences
      const labPreferenceStats = moduleList.reduce((stats, module) => {
        if (module.enrollment > 0) {
          stats[module.lab_preference] = (stats[module.lab_preference] || 0) + module.practical_sessions_expected;
        }
        return stats;
      }, {});

      console.log('\n🎯 UNIVERSAL PRACTICAL SESSION ANALYSIS:');
      console.log(`📊 Total modules: ${totalModules}`);
      console.log(`👥 Modules with students: ${modulesWithStudents.length}`);
      console.log(`🧪 Total practical sessions expected: ${totalPracticalSessions}`);
      console.log(`📚 ALL modules will have theoretical sessions`);
      console.log(`🔬 ALL modules (with students) will have practical sessions`);

      console.log('\n🔬 LAB SPECIALIZATION REQUIREMENTS:');
      Object.entries(labPreferenceStats).forEach(([preference, sessions]) => {
        console.log(`   - ${preference}: ${sessions} practical sessions`);
      });

      console.log('\n📋 DETAILED MODULE BREAKDOWN:');
      moduleList.forEach(m => {
        if (m.enrollment > 0) {
          console.log(`   ✅ ${m.module_name}: ${m.enrollment} students → ${m.practical_sessions_expected} practical sessions (${m.lab_preference} lab)`);
        } else {
          console.log(`   ⚪ ${m.module_name}: 0 students → no sessions generated`);
        }
      });

      // 8. 🔬 Enhanced lab capacity validation
      const totalLabCapacity = labRooms.length * scheduleParameters.days.length * scheduleParameters.time_slots.length;
      const labUtilizationPrediction = totalPracticalSessions / totalLabCapacity * 100;

      console.log('\n🔬 LAB CAPACITY ANALYSIS:');
      console.log(`   - Available labs: ${labRooms.length}`);
      console.log(`   - Time slots per week: ${scheduleParameters.days.length * scheduleParameters.time_slots.length}`);
      console.log(`   - Total lab capacity: ${totalLabCapacity} sessions/week`);
      console.log(`   - Required practical sessions: ${totalPracticalSessions}`);
      console.log(`   - Predicted lab utilization: ${labUtilizationPrediction.toFixed(1)}%`);

      if (labUtilizationPrediction > 80) {
        console.log('   ⚠️ WARNING: High lab utilization predicted - may need more labs or time slots');
      } else if (labUtilizationPrediction < 30) {
        console.log('   ✅ GOOD: Low lab utilization - plenty of capacity available');
      } else {
        console.log('   ✅ OPTIMAL: Moderate lab utilization - good balance');
      }

      // 9. Combine all data into the final structure
      const scheduleData = {
        schedule_parameters: scheduleParameters,
        rooms: roomList,
        teachers: teacherList,
        students: studentList,
        modules: moduleList,

        // 🎯 Enhanced metadata
        scheduling_approach: {
          type: 'universal',
          description: 'Every module gets both theoretical and practical sessions',
          practical_generation: 'automatic_for_all_modules',
          lab_capacity: 20,
          lab_distribution: 'enhanced_with_specialization',
          graduation_priority: true
        },

        // 🔬 Lab analysis metadata
        lab_analysis: {
          total_labs: labRooms.length,
          lab_specializations: labPreferenceStats,
          predicted_utilization: labUtilizationPrediction,
          capacity_status: labUtilizationPrediction > 80 ? 'high' : labUtilizationPrediction < 30 ? 'low' : 'optimal'
        }
      };

      console.log(`\n📊 FINAL DATA SUMMARY:`);
      console.log(`      - Modules: ${moduleList.length}`);
      console.log(`      - Students: ${studentList.length}`);
      console.log(`      - Teachers: ${teacherList.length}`);
      console.log(`      - Rooms: ${roomList.length} (${theoreticalRooms.length} theoretical, ${labRooms.length} lab)`);
      console.log(`      - Expected practical sessions: ${totalPracticalSessions}`);
      console.log(`      - Approach: Universal (all modules get practical sessions)`);
      console.log(`      - Lab distribution: Enhanced with specialization matching`);
      console.log(`      - Graduation priority: Enabled for final year students\n`);

      // 10. 🚀 Make API call to Enhanced Production Flask solver
      console.log('🚀 Sending data to Enhanced Flask Scheduler...');
      const response = await axios.post(
        'http://localhost:5000/schedule',
        scheduleData,
      );

      console.log(`✅ Flask Scheduler Response: ${response.status} ${response.statusText}`);

      return {
        success: true,
        data: response.data.data,
        status: response.status,
        statusText: response.statusText,
        practical_analysis: {
          approach: 'universal',
          total_modules: totalModules,
          modules_with_students: modulesWithStudents.length,
          total_practical_sessions_expected: totalPracticalSessions,
          all_modules_get_practical: true,
          lab_utilization_prediction: labUtilizationPrediction,
          lab_specializations: labPreferenceStats
        }
      };

    } catch (error) {
      console.error('❌ Error sending data to scheduling service:', error);

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

  /**
   * 🧪 Test version of infogenerate - returns data without API call
   */
  async infogenerateTest(): Promise<any> {
    try {
      // Get all necessary data from database
      const days = await this.daysModel.find().lean().exec();
      const hours = await this.hourModel.find().lean().exec();
      const modules = await this.moduleModel.find().lean().exec();
      const rooms = await this.roomModel.find().lean().exec();
      const teachers = await this.docTeachModel.find().lean().exec();
      const students = await this.studentModel.find().lean().exec();

      // Prepare schedule parameters
      const scheduleParameters = {
        days: days.map((d) => d.name),
        time_slots: [...new Set(hours.map((h) => h.value))],
        time_slots: [...new Set(hours.map((h) => h.value))],
        practical_sessions_per_theoretical: 1,
      };

      // Prepare rooms data
      const roomList = rooms.map((room) => ({
        room_id: room._id.toString(),
        room_name: room.name,
        capacity: room.capacity,
        type: room.theoretical ? 'theoretical' : 'lab',
      }));

      // Prepare teachers data
      const uniqueTeachers = new Map<string, any>();
      await Promise.all(
        teachers.map(async (teacher) => {
          if (uniqueTeachers.has(teacher.name)) {
            return;
          }

          const docHours = await this.DocHourModel.find({ docId: teacher._id })
            .lean()
            .exec();

          const availability = {};
          scheduleParameters.days.forEach((day) => {
            availability[day] = {};
            scheduleParameters.time_slots.forEach((slot) => {
              availability[day][slot] = false;
            });
          });

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

      const teacherList = Array.from(uniqueTeachers.values());

      // Prepare students data
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

      // 🎯 UNIVERSAL: Prepare modules - ALL modules get practical sessions
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
          module_id: module.name,
          module_code: module.code,
          module_name: module.name,
          teacher_name: teacherName,
          doctor_name: doctorName,
          enrollment: module.erolledStudents || 0,

          // 🎯 UNIVERSAL: Every module gets practical sessions
          needs_practical_sessions: true,
          subject_type: 'universal'
        };
      });

      // Return test data structure
      const scheduleData = {
        schedule_parameters: scheduleParameters,
        rooms: roomList,
        teachers: teacherList,
        students: studentList,
        modules: moduleList,
        scheduling_approach: {
          type: 'universal',
          description: 'Every module gets both theoretical and practical sessions'
        }
      };

      return scheduleData;
    } catch (error) {
      console.error('❌ Error preparing test data:', error);
      throw error;
    }
  }
}