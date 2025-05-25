// docteach.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { DocTeachService } from './docteach.service';
import { DocTeachDto } from './Dto/docteach.dto';

@Controller('doc-teach')
export class DocTeachController {
  constructor(private readonly docTeachService: DocTeachService) {}

  @Post()
  create(@Body() dto: DocTeachDto) {
    return this.docTeachService.create(dto);
  }

  @Get()
  findAll() {
    return this.docTeachService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.docTeachService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: DocTeachDto) {
    return this.docTeachService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.docTeachService.remove(id);
  }
}
