import { Module } from '@nestjs/common';
import { BinaryTreeService } from './binary_tree.service';
import { BinaryTreeController } from './binary_tree.controller';
import { GenericWorkerHost } from 'src/worker/worker.host';

@Module({
  providers: [GenericWorkerHost, BinaryTreeService],
  controllers: [BinaryTreeController],
})
export class BinaryTreeModule {}
