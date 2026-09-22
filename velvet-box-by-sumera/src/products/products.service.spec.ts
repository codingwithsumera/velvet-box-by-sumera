import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { vi, describe, beforeEach, it, expect } from 'vitest';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
