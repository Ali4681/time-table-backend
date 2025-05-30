import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { PracticalService } from './practical.service';
import { PracticalDto } from './Dto/practical.dto';

@Controller('practical')
export class PracticalController {
  constructor(private readonly practicalService: PracticalService) {}

  @Post()
  create(@Body() dto: PracticalDto) {
    return this.practicalService.create(dto);
  }

  @Get()
  findAll() {
    return this.practicalService.findAll();
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
}
