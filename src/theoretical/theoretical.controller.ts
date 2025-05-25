import { Controller } from '@nestjs/common';
import { TheoreticalService } from './theoretical.service';

@Controller('theoretical')
export class TheoreticalController {
  constructor(private readonly theoreticalService: TheoreticalService) {}
}
