import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { payloadDto } from './Dto/auth.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'ali123',
    });
  }

  async validate(payload: any): Promise<payloadDto> {
    const user = await this.userService.getOneUser(payload.id);
    if (!user) throw new NotFoundException('User not found');

    return {
      id: String(user._id),
      email: user.email,
      username: user.fullName,
    };
  }
}
