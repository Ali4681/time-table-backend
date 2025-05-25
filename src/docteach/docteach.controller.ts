import { Controller } from '@nestjs/common';
import { DocTeachService } from './docteach.service';

@Controller('doc-teach')
export class DocTeachController {
  constructor(private readonly docTeachService: DocTeachService) {}
}
