import { Cache } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { StringOutput } from 'src/type';
import { GenericWorkerHost } from 'src/worker/worker.host';
import { SubstringService } from './substring.service';
import { User } from 'src/auth/user.decorator';
import { AccessTokenPayload } from 'src/auth/input/signup.input';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('/substring')
@UseGuards(JwtAuthGuard, ThrottlerGuard)
export class SubstringController {
  private readonly logger = new Logger(SubstringService.name);

  constructor(
    private readonly workerHost: GenericWorkerHost,
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
    private substringService: SubstringService,
  ) {}

  @Post()
  async findLongestSubstring(
    @Body() body: { inputString: string },
    @User() user: AccessTokenPayload,
  ): Promise<StringOutput> {
    const { inputString } = body;
    const cacheKey = `string:${inputString}`;
    let cachedResult: StringOutput;

    try {
      // Fetch from cache
      cachedResult = (await this.cacheManager.get(cacheKey)) as StringOutput;
      if (cachedResult) {
        this.logger.log('Returning cached result');
        return cachedResult;
      }

      // Run calculations if not cached
      const [longestSubstring, uniqueSubstring] = await Promise.all([
        this.workerHost.run('longestSubstring', inputString),
        this.workerHost.run('uniqueSubstrings', inputString),
      ]);

      cachedResult = { longestSubstring, uniqueSubstring };

      // Cache result
      await this.cacheManager.set(cacheKey, cachedResult);
      this.logger.log('Result cached successfully');

      // Save to DB
      await this.substringService.storeResultInDB(
        cachedResult,
        user,
        inputString,
      );
      this.logger.log('Result stored in database');

      return cachedResult;
    } catch (error) {
      this.logger.error('Error in findLongestSubstring:', error.stack);

      // Return a standardized error response
      throw new HttpException(
        'An error occurred while processing your request. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/history')
  async getAllHistory(@User() user: AccessTokenPayload) {
    const userId = user.sub;

    try {
      const allHistory = await this.substringService.getAllHistory(userId);
      console.log(allHistory);
      this.logger.log(`History retrieved for user: ${userId}`);
      return allHistory;
    } catch (error) {
      this.logger.error('Error retrieving history:', error.stack);

      throw new HttpException(
        'Failed to retrieve calculation history. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
