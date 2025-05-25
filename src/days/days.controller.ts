import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { DaysService } from './days.service';
import { DayDto } from './Dto/days.dto';


@Controller('days')
export class DaysController {
  constructor(private readonly daysService: DaysService) {}

  @Post()
  create(@Body() createDayDto: DayDto) {
    return this.daysService.create(createDayDto);
  }

  @Get()
  findAll() {
    return this.daysService.findAll();
  }



  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDayDto: DayDto) {
    return this.daysService.update(id, updateDayDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.daysService.remove(id);
  }
}
