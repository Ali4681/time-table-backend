import {
  ConflictException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserDto, ForgotPasswordDto, ResetPasswordDto } from './Dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import axios from 'axios';

@Injectable()
export class UserService {
  private readonly SALT_ROUNDS = 10;
  private readonly RESET_TOKEN_EXPIRY = 3600000; // 1 hour in milliseconds

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createUser(add: UserDto): Promise<User> {
    await this.validateEmail(add.email);

    try {
      const hashedPassword = await bcrypt.hash(add.password, this.SALT_ROUNDS);
      const newUser = new this.userModel({
        ...add,
        password: hashedPassword,
        isActive: add.isActive !== undefined ? add.isActive : true,
      });

      const savedUser = await newUser.save();
      return this.sanitizeUser(savedUser.toObject());
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async saveChatIdByPhoneNumber(dto: {
    phoneNumber: string;
    chatId: string;
  }): Promise<{ message: string }> {
    try {
      // Normalize phone number format
      const normalizedPhone = dto.phoneNumber.startsWith('+')
        ? dto.phoneNumber
        : `+${dto.phoneNumber}`;


      const user = await this.userModel.findOneAndUpdate(
        { phoneNumber: normalizedPhone },
        { $set: { chatId: dto.chatId } },
        { new: true },
      );

      if (!user) {
        throw new NotFoundException('User not found with this phone number');
      }

      return { message: 'Chat ID saved successfully' };
    } catch (error) {
      console.error('Error in saveChatIdByPhoneNumber:', error); // Detailed error log
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to save chat ID: ' + error.message,
      );
    }
  }

  async getAllUser(): Promise<User[]> {
    try {
      const users = await this.userModel.find().lean().exec();
      return users.map((user) => this.sanitizeUser(user));
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  async getOneUser(id: string): Promise<User> {
    this.validateObjectId(id);

    try {
      const user = await this.userModel.findById(id).lean().exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return this.sanitizeUser(user);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch user');
    }
  }

  async getOneEmail(email: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({ email }).lean().exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user; // Return full user object for auth purposes
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch user by email');
    }
  }

  async deleteUser(
    id: string,
  ): Promise<{ message: string; deletedUser: User }> {
    this.validateObjectId(id);

    try {
      const deletedUser = await this.userModel
        .findByIdAndDelete(id)
        .lean()
        .exec();
      if (!deletedUser) {
        throw new NotFoundException('User not found');
      }
      return {
        message: 'User deleted successfully',
        deletedUser: this.sanitizeUser(deletedUser),
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete user');
    }
  }

  async updateUser(id: string, updateUserDto: Partial<UserDto>): Promise<User> {
    this.validateObjectId(id);

    try {
      if (updateUserDto.email) {
        await this.validateEmail(updateUserDto.email, id);
      }

      const updateData: any = { ...updateUserDto, updatedAt: new Date() };

      if (updateUserDto.password) {
        updateData.password = await bcrypt.hash(
          updateUserDto.password,
          this.SALT_ROUNDS,
        );
      }

      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .lean()
        .exec();

      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }
      return this.sanitizeUser(updatedUser);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  private generateSecureOTP() {
    // Generate 4 random bytes (32 bits) - more than enough for 5 digits
    const randomBytes = crypto.randomBytes(4);
    // Convert to a 32-bit unsigned integer
    const randomNumber = randomBytes.readUInt32BE(0);
    // Scale to 5-digit range (10000-99999)
    const otp = 10000 + (randomNumber % 90000);
    return otp.toString();
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string; otp?: string }> {
    try {
      const user = await this.userModel.findOne({
        phoneNumber: forgotPasswordDto.phoneNumber,
      });

      if (!user) {
        // Security: Don't reveal if phone number exists
        return {
          message:
            'If your phone number is registered, you will receive an OTP to reset password',
        };
      }

      try {
        const BOT_TOKEN = '7869955028:AAEeC5z0EMcJAQEHsBa8yp784yK_OnuDvgM';
        const OTP = this.generate4DigitOTP(); // Changed to 4-digit OTP
        const OTP_EXPIRY_MINUTES = 5; // OTP expires after 5 minutes

        // Store OTP and expiry time in user document
        user.passwordResetToken = OTP;
        user.passwordResetExpires = new Date(
          Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000,
        );
        await user.save();

        // Send OTP via Telegram
        await axios
          .post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            chat_id: user.chatId,
            text: `Your password reset OTP is: ${OTP}\nThis code will expire in ${OTP_EXPIRY_MINUTES} minutes.`,
          })
          .then((res) => res.data)
          .then((data) => {
          })
          .catch((err) => {
            console.error('Error sending message:', err);
            // Clear the reset token if sending fails
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            user.save();
          });

        return {
          otp: OTP, // Note: In production, you might not want to return the OTP
          message:
            'If your phone number is registered, you will receive an OTP to reset password',
        };
      } catch (error) {
        console.error('OTP sending failed:', error);
        // Clear the reset token if any error occurs
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        throw new InternalServerErrorException(
          'Failed to send password reset OTP',
        );
      }
    } catch (error) {
      console.error('Password reset error:', error);
      throw new InternalServerErrorException(
        'Failed to process password reset request',
      );
    }
  }

  // Generate 4-digit OTP
  private generate4DigitOTP(): string {
    return Math.floor(1000 + Math.random() * 9000).toString(); // Generates a 4-digit number
  }
  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    try {
      const user = await this.userModel.findOne({
        phoneNumber: resetPasswordDto.phoneNumber,
      });

      if (!user) {
        throw new UnauthorizedException('Invalid or expired token');
      }

      // Update password and clear reset token
      user.password = await bcrypt.hash(
        resetPasswordDto.newPassword,
        this.SALT_ROUNDS,
      );
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      return { message: 'Password reset successfully' };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to reset password');
    }
  }

  private async validateEmail(
    email: string,
    excludeUserId?: string,
  ): Promise<void> {
    try {
      const query = { email };
      if (excludeUserId) {
        query['_id'] = { $ne: excludeUserId };
      }

      const user = await this.userModel.findOne(query);
      if (user) {
        throw new ConflictException('User with this email already exists');
      }
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Email validation failed');
    }
  }

  private validateObjectId(id: string): void {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException('Invalid user ID format');
    }
  }

  private sanitizeUser(user: User): User {
    const {
      password,
      passwordResetToken,
      passwordResetExpires,
      ...userWithoutSensitiveData
    } = user;
    return userWithoutSensitiveData as User;
  }
}
