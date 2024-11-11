import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // Payload contains the data from the token
    const user = await this.authService.findByUserId(payload.sub);
    console.log('hello jwt');

    if (!user || user._id.toString() !== payload.sub) {
      throw new UnauthorizedException('Invalid user ID');
    }
    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
