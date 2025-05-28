import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Patch,
} from '@nestjs/common';
import { ModuleService } from './modules.service';

@Controller('modules')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Get()
  findAll() {
    return this.moduleService.findAll();
  }
  @Get(':moduleId/students')
  async getStudentsByModule(@Param('moduleId') moduleId: string) {
    return this.moduleService.getStudentsByModule(moduleId);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.moduleService.findById(id);
  }
  @Get(':id/all')
  findAllmoduleandpractica(@Param('id') id: string) {
    return this.moduleService.findAllmoduleandpractica(id);
  }

  @Post()
  create(@Body() data) {
    return this.moduleService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data) {
    return this.moduleService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.moduleService.delete(id);
  }
}
