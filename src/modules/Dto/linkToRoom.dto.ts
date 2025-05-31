import { IsNotEmpty, IsMongoId } from 'class-validator';

export class LinkToRoomDto {
  @IsNotEmpty()
  @IsMongoId()
  sessionTimeId: string;

  @IsNotEmpty()
  @IsMongoId()
  moduleId: string;

  @IsNotEmpty()
  @IsMongoId()
  roomId: string;
}


