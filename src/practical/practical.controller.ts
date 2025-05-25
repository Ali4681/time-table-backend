import { Controller } from '@nestjs/common';
import { PracticalService } from './practical.service';

@Controller('practical')
export class PracticalController {
  constructor(private readonly practicalService: PracticalService) {}
}
