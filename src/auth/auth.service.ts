import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserDto } from 'src/user/Dto/user.dto';
import { UserService } from 'src/user/user.service';
import { AuthDto, payloadDto } from './Dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(dto: UserDto) {
    const hashed = bcrypt.hashSync(dto.password, 10);
    const user = await this.userService.createUser({
      ...dto,
      password: hashed,
    });
    return { status: true, message: 'User created successfully', user };
  }

  async signIn(dto: AuthDto) {
    const user = await this.userService.getOneEmail(dto.email);
    if (!user || !bcrypt.compareSync(dto.password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: payloadDto = {
      id: String(user._id),
      email: user.email,
      username: user.fullName,
    };

    return { token: this.jwtService.sign(payload), user };
  }
}
