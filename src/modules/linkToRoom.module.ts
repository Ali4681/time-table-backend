// link-to-room.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { linkToRoomType, linkToRoomTypeSchema } from './linkToRoom.schema';
import { LinkToRoomService } from './linkToRoom.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: linkToRoomType.name, schema: linkToRoomTypeSchema },
    ]),
  ],
  providers: [LinkToRoomService],
  exports: [LinkToRoomService], // This is crucial!
})
export class LinkToRoomModule {}
