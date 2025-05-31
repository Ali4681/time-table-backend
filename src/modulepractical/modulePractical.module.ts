import { MongooseModule } from "@nestjs/mongoose";
import { ModulePractical, ModulePracticalSchema } from "./modulePractical.schema";
import { Module } from '@nestjs/common';
import { ModulePracticalService } from "./modulePractical.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModulePractical.name, schema: ModulePracticalSchema },
    ]),
  ],
  providers: [ModulePracticalService],
  exports: [ModulePracticalService],
})
export class ModulePracticalModule {}
