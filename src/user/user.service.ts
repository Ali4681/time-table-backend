  import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserDto } from './Dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createUser(add: UserDto) {
    const notFound = await this.validateEmail(add.email);

    if (notFound) {
      const newUser = new this.userModel(add);
      return newUser.save();
    } else {
      throw new ConflictException('user ........');
    }
  }

  async getAllUser() {
    return await this.userModel.find().lean().exec();
  }

  async getOneUser(id: string) {
    console.log(id);

    const user = await this.userModel.findById(id).lean().exec();
    if (user) return user;
    else throw new NotFoundException('user not found');
  }
  async getOneEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).lean().exec();
    if (user) return user;
    else throw new NotFoundException('user not found');
  }

  async deleteUser(id: string) {
    const deUser = await this.userModel.findByIdAndDelete(id);
    if (deUser) return 'deleteeeeeeeeeeeeeee';
    else throw new NotFoundException('user not found');
  }
  async updateUser(id: string, updateUserDto: UserDto) {
    const updUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto)
      .lean()
      .exec();

    if (updUser) return 'updateeeed';
    else throw new NotFoundException('cant update task');
  }

  private async validateEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      return true;
    } else {
      throw new ConflictException('user already exist');
    }
  }
}
