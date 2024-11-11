import { Module } from '@nestjs/common';
import { SubstringController } from './substring.controller';
import { GenericWorkerHost } from 'src/worker/worker.host';
import { SubstringService } from './substring.service';
import {
  StringHistory,
  StringHistorySchema,
} from './entities/string-history.schema.ts';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StringHistory.name, schema: StringHistorySchema },
    ]),
  ],
  providers: [GenericWorkerHost, SubstringService],
  controllers: [SubstringController],
})
export class SubstringModule {}
