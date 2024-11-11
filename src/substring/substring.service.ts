import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { StringHistory } from './entities/string-history.schema.ts';
import { StringOutput, TreeOutput } from 'src/type.js';
import { AccessTokenPayload } from 'src/auth/input/signup.input.js';

export class SubstringService {
  private readonly logger = new Logger(SubstringService.name); // Logger for debugging

  constructor(
    @InjectModel(StringHistory.name)
    private readonly stringHistoryModel: Model<StringHistory>,
  ) {}

  async storeResultInDB(
    result: StringOutput,
    user: AccessTokenPayload,
    input: string,
  ) {
    try {
      // Create a new StringHistory document
      const history = new this.stringHistoryModel({
        input: input,
        longestSubstring: result.longestSubstring,
        uniqueSubstrings: result.uniqueSubstring,
        userId: new Types.ObjectId(user.sub), // Ensure user.sub is a valid ObjectId string
      });

      // Save the history document to the database
      await history.save();
      this.logger.log('Successfully saved string history to DB');
    } catch (error) {
      this.logger.error(
        'Error while saving string history to DB:',
        error.stack,
      );
      throw error; // Rethrow the error so it can be caught by NestJS global error handler
    }
  }

  async getAllHistory(userId: string): Promise<TreeOutput[]> {
    try {
      // Validate userId as an ObjectId to prevent invalid queries
      if (!Types.ObjectId.isValid(userId)) {
        throw new BadRequestException('Invalid user ID format.');
      }

      // Execute query to retrieve history
      const result = await this.stringHistoryModel
        .find({ userId: new Types.ObjectId(userId) })
        .select('input longestSubstring uniqueSubstrings') // Select only necessary fields
        .exec();

      const output: TreeOutput[] = [];
      result.forEach((object) => {
        output.push({
          input: object.input,
          longestSubstring: object.longestSubstring,
          uniqueSubstrings: object.uniqueSubstrings,
        });
      });

      return output;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; // Re-throw the bad request exception
      } else {
        console.error('Error retrieving history:', error);
        throw new InternalServerErrorException(
          'An error occurred while retrieving calculation history. Please try again later.',
        );
      }
    }
  }
}
