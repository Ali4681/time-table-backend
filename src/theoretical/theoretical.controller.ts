import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TheoreticalService } from './theoretical.service';
import { TheoreticalDto } from './Dto/theoretical.dto';

@Controller('theoretical')
export class TheoreticalController {
  constructor(private readonly theoreticalService: TheoreticalService) {}

  @Post()
  create(@Body() dto: TheoreticalDto) {
    return this.theoreticalService.create(dto);
  }

  @Get()
  findAll() {
    return this.theoreticalService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.theoreticalService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: TheoreticalDto) {
    return this.theoreticalService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.theoreticalService.remove(id);
  }
}
