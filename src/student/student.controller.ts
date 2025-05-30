import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { StudentService } from './student.service';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  findAll() {
    return this.studentService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.studentService.findById(id);
  }

  @Post()
  create(@Body() data) {
    return this.studentService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data) {
    return this.studentService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.studentService.delete(id);
  }

  // ✅ تسجيل الطالب في مادة
  @Post(':id/register')
  registerToModule(
    @Param('id') studentId: string,
    @Body() body: { moduleId: string; practicalId: string },
  ) {
    return this.studentService.registerToModule(
      studentId,
      body.moduleId,
      body.practicalId,
    );
  }

  // ✅ عرض المواد التي سجلها الطالب
  @Get(':id/modules')
  getModules(@Param('id') studentId: string) {
    return this.studentService.getModulesForStudent(studentId);
  }

  // ✅ إلغاء تسجيل الطالب من مادة
  @Delete(':id/unregister/:moduleId')
  unregisterFromModule(
    @Param('id') studentId: string,
    @Param('moduleId') moduleId: string,
  ) {
    return this.studentService.unregisterFromModule(studentId, moduleId);
  }
}
