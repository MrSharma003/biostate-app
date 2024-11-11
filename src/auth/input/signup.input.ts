import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserSignupPayload {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  role: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export interface AccessTokenPayload {
  email: string;
  role: string;
  sub: string;
}
