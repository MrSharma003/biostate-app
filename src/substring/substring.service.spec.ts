import { Test, TestingModule } from '@nestjs/testing';
import { SubstringService } from './substring.service';

describe('SubstringService', () => {
  let service: SubstringService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubstringService],
    }).compile();

    service = module.get<SubstringService>(SubstringService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
