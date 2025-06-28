import { IsEmail, IsString } from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsString()
  email: string;
  @IsString()
  password: string;
}
export class payloadDto {
  @IsString()
  id: string;
  @IsString()
  email: string;
  @IsString()
  username: string;

}
