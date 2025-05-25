import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { HoursService } from './hours.service';
import { HoursDto } from './Dto/hours.dto';

@Controller('hours')
export class HoursController {
  constructor(private readonly hoursService: HoursService) {}

  @Post()
  create(@Body() createHoursDto: HoursDto) {
    return this.hoursService.create(createHoursDto);
  }

  @Get()
  findAll() {
    return this.hoursService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHoursDto: HoursDto) {
    return this.hoursService.update(id, updateHoursDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hoursService.remove(id);
  }
}
