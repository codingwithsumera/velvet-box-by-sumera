import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller.js';
import { ProductsService } from './products.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { vi, describe, beforeEach, it, expect } from 'vitest';

describe('ProductsController', () => {
  let controller: ProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: {
            product: {
              create: vi.fn(),
              all: vi.fn(),
              where: vi.fn().mockReturnValue({
                first: vi.fn(),
                update: vi.fn(),
                delete: vi.fn(),
              }),
            },
            category: {
              where: vi.fn().mockReturnValue({
                first: vi.fn(),
              }),
            },
          },
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
