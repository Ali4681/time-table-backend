import { Controller } from '@nestjs/common';
import { DaysService } from './days.service';

@Controller('days')
export class DaysController {
  constructor(private readonly daysService: DaysService) {}
}
