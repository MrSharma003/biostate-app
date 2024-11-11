import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AccessTokenPayload, UserSignupPayload } from './input/signup.input';
import { User } from './entities/User';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { RefreshTokenAuth } from './entities/RefreshTokenAuth';
import { error } from 'console';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(RefreshTokenAuth.name)
    private refreshTokenModel: Model<RefreshTokenAuth>,
    private jwtService: JwtService,
  ) {}

  static readonly SALT_ROUNDS = 10;

  private readonly adminEmails = ['admin@example.com', 'superuser@example.com'];
  private readonly refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
  private readonly jwtTokenSecret = process.env.JWT_SECRET;

  private generateAccessToken(jwtPayload: AccessTokenPayload) {
    const accessToken = this.jwtService.sign(jwtPayload, {
      secret: this.jwtTokenSecret,
      expiresIn: '1h',
    });

    return accessToken;
  }
  // handling refresh token rotation and token revocation
  private async generateAndSaveRefreshToken(payload: any) {
    try {
      const userId = payload.sub;

      // Generate a new refresh token
      const token = this.jwtService.sign(payload, {
        secret: this.jwtTokenSecret,
        expiresIn: '30d',
      });

      // Revoke any previous refresh tokens for this user
      await this.refreshTokenModel.updateMany(
        { userId, isRevoked: false },
        { $set: { isRevoked: true } },
      );

      // Save the new refresh token in the database
      const tokenDto = new this.refreshTokenModel({
        userId,
        token,
        isRevoked: false,
        createdAt: new Date(),
      });

      await tokenDto.save();

      return token;
    } catch (error) {
      // Error handling based on the type of error
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Failed to sign token');
      } else if (error.code === 11000) {
        // Handling MongoDB unique constraint error (if there's a conflict)
        throw new ConflictException('Duplicate token entry');
      } else {
        // Generic error catch
        throw new InternalServerErrorException(
          'Error generating refresh token',
        );
      }
    }
  }

  //   private async blakListRefreshToken(token: string) {
  //     await this.refreshTokenModel.updateOne(
  //       { token },
  //       { $set: { isRevoked: true } },
  //     );
  //   }

  async hashedPassword(password: string) {
    return bcrypt.hash(password, AuthService.SALT_ROUNDS);
  }

  async saveUser(user: UserSignupPayload) {
    const { name, email, password, role } = user;
    if (role === 'admin' && !this.adminEmails.includes(email)) {
      throw new UnauthorizedException(
        'User with this email dont have permission to register as admin',
      );
    }
    // check exsiting user
    const exsitingUser = await this.userModel.findOne({ email: email });
    if (exsitingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await this.hashedPassword(password);

    const fullName = name.split(' ');
    const newUser = new this.userModel({
      firstName: fullName[0],
      lastName: fullName[1],
      email,
      role,
      password: hashedPassword,
    });

    try {
      await newUser.save();
      return { message: 'User signed up successfully' };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error saving user to the database: ${error}`,
      );
    }
  }

  async signIn(email: string, password: string) {
    const exsitingUser = await this.userModel.findOne({ email });
    if (!exsitingUser) {
      const error = new UnauthorizedException('Invalid email or password');
      return { authUser: null, error };
    }

    const isValidPassword = await bcrypt.compare(
      password,
      exsitingUser.password,
    );

    if (!isValidPassword) {
      const error = new UnauthorizedException('Invalid email or password');
      return { authUser: null, error };
    }

    const jwtPayload: AccessTokenPayload = {
      email: exsitingUser.email,
      role: exsitingUser.role,
      sub: exsitingUser._id as string,
    };

    const accessToken = this.generateAccessToken(jwtPayload);

    const refreshToken = await this.generateAndSaveRefreshToken({
      sub: exsitingUser._id,
    });

    return {
      authUser: {
        message: 'User signed in successfully',
        user: {
          id: exsitingUser._id,
          firstName: exsitingUser.firstName,
          lastName: exsitingUser.lastName,
          role: exsitingUser.role,
        },
        accessToken,
        refreshToken,
      },
      error: null,
    };
  }

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh Token Required');
    }

    try {
      const { userId } = await this.jwtService.verify(refreshToken);
      const user = await this.userModel.findOne({ userId });
      if (!user) {
        throw new UnauthorizedException('Invalid Refresh Token');
      }
      const payload: AccessTokenPayload = {
        email: user.email,
        sub: user._id as string,
        role: user.role,
      };

      //   await this.blakListRefreshToken(refreshToken);

      const newRefreshToken = await this.generateAndSaveRefreshToken({
        userId,
      });

      const accessToken = this.generateAccessToken(payload);

      return { accessToken: accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new UnauthorizedException(
        'Unable to generate access token: ',
        error,
      );
    }
  }

  async findByUserId(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    return user;
  }
}
