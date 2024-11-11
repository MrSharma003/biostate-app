import { Test, TestingModule } from '@nestjs/testing';
import { BinaryTreeService } from './binary_tree.service';

describe('BinaryTreeService', () => {
  let service: BinaryTreeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BinaryTreeService],
    }).compile();

    service = module.get<BinaryTreeService>(BinaryTreeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
