import { Body, Controller, Post } from '@nestjs/common';
import { UserSignupPayload } from './input/signup.input';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerUser(@Body() userPayload: UserSignupPayload) {
    return this.authService.saveUser(userPayload);
  }

  @Post('sign-in')
  async signIn(@Body() body: { email: string; password: string }) {
    console.log('in sign in');
    return this.authService.signIn(body.email, body.password);
  }
}
