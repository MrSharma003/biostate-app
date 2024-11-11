import { Test, TestingModule } from '@nestjs/testing';
import { SubstringController } from './substring.controller';

describe('SubstringController', () => {
  let controller: SubstringController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubstringController],
    }).compile();

    controller = module.get<SubstringController>(SubstringController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
