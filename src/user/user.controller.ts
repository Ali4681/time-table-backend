import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  UserDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  SaveChatIdDto,
} from './Dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() createUserBody: UserDto) {
    return this.userService.createUser(createUserBody);
  }

  @Get()
  getAllUser() {
    return this.userService.getAllUser();
  }

  @Post('save-chat-id')
  saveChatId(@Body() dto: SaveChatIdDto) {
    return this.userService.saveChatIdByPhoneNumber(dto);
  }

  @Get(':id')
  getOneUser(@Param('id') id: string) {
    return this.userService.getOneUser(id);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() updateUserBody: UserDto) {
    return this.userService.updateUser(id, updateUserBody);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.userService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.userService.resetPassword(resetPasswordDto);
  }
}
