import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Patch,
  NotFoundException,
  Put,
} from '@nestjs/common';
import { ModuleService } from './modules.service';
import { LinkToRoomService } from './linkToRoom.service';
import { LinkToRoomDto } from './Dto/linkToRoom.dto';
import { linkToRoomType } from './linkToRoom.schema';

@Controller('modules')
export class ModuleController {
  constructor(
    private readonly moduleService: ModuleService,
    private readonly linkToRoomService: LinkToRoomService,
  ) {}

  @Get()
  findAll() {
    return this.moduleService.findAll();
  }
  @Post('selectRoom')
  selectRoom(@Body() dto: LinkToRoomDto) {
    return this.linkToRoomService.create(dto);
  }
  @Get('getroom')
  async findAllLink() {
    return this.linkToRoomService.findAll();
  }
  @Get(':moduleId/students')
  async getStudentsByModule(@Param('moduleId') moduleId: string) {
    return this.moduleService.getStudentsByModule(moduleId);
  }

  @Get(':id/module')
  findById(@Param('id') id: string) {
    return this.moduleService.findById(id);
  }
  @Get(':id/withInfo')
  findAllModuleWithDoctorATeacher(@Param('id') id: string) {
    return this.moduleService.findModuleWithDoctorATeacher(id);
  }
  @Get(':id/all')
  findAllmoduleandpractica(@Param('id') id: string) {
    return this.moduleService.findAllmoduleandpractica(id);
  }

  @Post()
  create(@Body() data) {
    return this.moduleService.create(data);
  }

  @Patch(':id/update')
  updateLink(@Param('id') id: string, @Body() data) {
    return this.moduleService.update(id, data);
  }

  @Delete(':id/delete')
  delete(@Param('id') id: string) {
    return this.moduleService.delete(id);
  }

  @Get(':id/link')
  async findOne(@Param('id') id: string) {
    try {
      return await this.linkToRoomService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Patch(':id/updatelink')
  async update(
    @Param('id') id: string,
    @Body() updateDto: LinkToRoomDto,
  ): Promise<linkToRoomType> {
    try {
      return await this.linkToRoomService.update(id, updateDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Delete(':id/deletelink')
  async remove(@Param('id') id: string): Promise<linkToRoomType> {
    try {
      return await this.linkToRoomService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
