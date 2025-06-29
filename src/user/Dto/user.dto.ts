import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class UserDto {
  @IsEmail()
  email: string;

  @IsString()
  fullName: string;

  @IsString()
  password: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class ForgotPasswordDto {
  @IsString()
  phoneNumber: string;
}

export class ResetPasswordDto {
  @IsString()
  token: string;
  @IsString()
  phoneNumber;
  @IsString()
  newPassword: string;
}
export class SaveChatIdDto {
  phoneNumber: string;
  chatId: string;
}
