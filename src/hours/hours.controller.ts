import { Controller } from '@nestjs/common';
import { HoursService } from './hours.service';

@Controller('hours')
export class HoursController {
  constructor(private readonly hoursService: HoursService) {}
}
