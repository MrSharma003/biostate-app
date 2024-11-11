import { Test, TestingModule } from '@nestjs/testing';
import { BinaryTreeController } from './binary_tree.controller';

describe('BinaryTreeController', () => {
  let controller: BinaryTreeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BinaryTreeController],
    }).compile();

    controller = module.get<BinaryTreeController>(BinaryTreeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
