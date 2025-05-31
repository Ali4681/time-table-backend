import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { PracticalService } from './practical.service';
import { PracticalDto } from './Dto/practical.dto';
import { ModulePracticalService } from 'src/modulepractical/modulePractical.service';
import { ModulePracticalDto } from 'src/modulepractical/dto/modulePractical.dto';

@Controller('practical')
export class PracticalController {
  constructor(
    private readonly practicalService: PracticalService,
    private readonly service: ModulePracticalService,
  ) {}

  @Post()
  create(@Body() dto: PracticalDto) {
    return this.practicalService.create(dto);
  }

  @Get()
  findAll() {
    return this.practicalService.findAll();
  }
  @Get('allPraModule')
  findAllPraModule() {
    return this.service.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.practicalService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: PracticalDto) {
    return this.practicalService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.practicalService.remove(id);
  }
  //////////////////////////////

  @Post('createPraModule')
  createPraModule(@Body() data: ModulePracticalDto) {
    return this.service.create(data);
  }

  @Delete(':id/PraModule')
  removePraModule(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Get(':practical/PraModule')
  findByPracticalId(@Param('practical') practical: string) {
    return this.service.findByPracticalId(practical);
  }

  @Get(':moduleId/PraModule')
  findByModuleTypeId(@Param('moduleId') moduleId: string) {
    return this.service.findByModuleTypeId(moduleId);
  }

  @Get(':practicalId/:moduleId/PraModule')
  findByBothIds(
    @Param('practicalId') practicalId: string,
    @Param('moduleId') moduleId: string,
  ) {
    return this.service.findByBothIds(practicalId, moduleId);
  }
}
