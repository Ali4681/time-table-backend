// room.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoomType } from './room.schema';
import { RoomDto } from './dto/room.dto';
import { DaysType } from 'src/days/days.schema';
import { HoursType } from 'src/hours/hours.schema';
import { ModulesType } from 'src/modules/modules.schema';
import { DocTeachType } from 'src/docteach/docteach.schema';
import { StudentType } from 'src/student/student.schema';
import { DocHourType } from 'src/docteach/doc-hour.schema';
import { StudentModuleType } from 'src/studentmodule/studentmodule.schema';

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
    private StudentModuleModel: Model<StudentModuleType>,
  ) {}

  async create(createRoomDto: RoomDto): Promise<RoomType> {
    const newRoom = new this.roomModel(createRoomDto);
    return newRoom.save(); // uses .save()
  }

  async findAll(): Promise<RoomType[]> {
    return this.roomModel.find().exec(); // uses .exec()
  }

  async findOne(id: string): Promise<RoomType> {
    const room = await this.roomModel.findById(id).exec(); // uses .exec()
    if (!room) throw new NotFoundException('Room not found');
    return room;
  }

  async update(id: string, updateRoomDto: RoomDto): Promise<RoomType> {
    const room = await this.roomModel
      .findByIdAndUpdate(id, updateRoomDto, { new: true })
      .exec(); // uses .exec()
    if (!room) throw new NotFoundException('Room not found');
    return room;
  }

  async remove(id: string): Promise<void> {
    const result = await this.roomModel.findByIdAndDelete(id).exec(); // uses .exec()
    if (!result) throw new NotFoundException('Room not found');
  }

  async infogenrate() {
    const days = await this.daysModel.find().lean().exec(); // Assume: [{ name: "Monday" }, ...]
    const hours = await this.hourModel.find().lean().exec(); // Assume: [{ slot: "08:00-09:30" }, ...]
    const modules = await this.moduleModel.find().lean().exec();
    const rooms = await this.roomModel.find().lean().exec();
    const teachers = await this.docTeachModel.find().lean().exec();
    const students = await this.studentModel.find().lean().exec();

    const schedule_parameters = {
      days: days.map((d) => d.name), // e.g., "Monday", "Tuesday", ...
      time_slots: ['8:30', '10:00', '11:45', '1:30'], // e.g., "08:00-09:30", ...
      practical_sessions_per_theoretical: 1,
    };

    const moduleList = modules.map((m) => ({
      module_id: m._id, // أو m.moduleId حسب البنية
      module_code: m.code,
      module_name: m.name,
      enrollment: m.erolledStudents || 0,
      year_groups: m.years || [],
      theoretical_sessions: 1, //m.theoretical_sessions ||
      practical_sessions_per_theoretical: 1, //m.practical_sessions_per_theoretical ||
      teacher_id: m.doctorsId,
      type: 'mixed', //m.type ||
    }));

    const roomList = rooms.map((r) => ({
      room_id: r._id,
      room_name: r.name,
      capacity: r.capacity,
      type: r.theoretical ? 'lecture_hall' : 'lab', //i wanna to add type in room bolean or (prctical || theoretical)
    }));

    const teacherList = await Promise.all(
      teachers.map(async (t) => {
        const docHours = await this.DocHourModel.find({ docId: t._id })
          .lean()
          .exec();

        const availability = {}; // لتجميع الأيام والفترات الزمنية
        for (const day of schedule_parameters.days) {
          availability[day] = {};
          for (const slot of schedule_parameters.time_slots) {
            availability[day][slot] = false;
          }
        }

        // 2. اجعل الفترات الموجودة في docHours = true
        for (const docHour of docHours) {
          const hourData = await this.hourModel
            .findOne({ _id: docHour.hourId })
            .lean()
            .exec();
          if (!hourData || !hourData.daysId) continue;

          const dayData = await this.daysModel
            .findOne({ _id: hourData.daysId })
            .lean()
            .exec();
          if (!dayData) continue;

          const dayName = dayData.name.toString(); // مثل "Monday"
          const timeSlot = hourData.value; // مثل "8:30", "10:00", إلخ

          if (
            availability[dayName] &&
            availability[dayName].hasOwnProperty(timeSlot)
          ) {
            availability[dayName][timeSlot] = true;
          }
        }

        return {
          teacher_id: t._id,
          teacher_name: t.name,
          availability, // الآن بهذا الشكل: { Monday: [...], Tuesday: [...], ... }
        };
      }),
    );

    const studentList = await Promise.all(
      students.map(async (s) => {
        const enrolledModules = await this.StudentModuleModel.find({
          student: s._id,
        })
          .lean()
          .exec();

        const moduleIds = enrolledModules.map((em) => em.module); // هذا ObjectId[]

        const modules = await this.moduleModel
          .find({ _id: { $in: moduleIds } })
          .lean()
          .exec();

        const moduleLists = modules.map((m) => m.code);

        return {
          student_id: s._id,
          year_group: s.years,
          retake_modules: moduleLists,
        };
      }),
    );

    return {
      schedule_parameters,
      modules: moduleList,
      rooms: roomList,
      teachers: teacherList,
      students: studentList,
      optimizationMode: 'feasible',
    };
  }
}
