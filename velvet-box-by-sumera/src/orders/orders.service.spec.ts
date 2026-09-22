import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { vi, describe, beforeEach, it, expect } from 'vitest';

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: PrismaService,
          useValue: {
            order: {
              create: vi.fn(),
              all: vi.fn(),
              where: vi.fn().mockReturnValue({
                all: vi.fn(),
                first: vi.fn(),
                update: vi.fn(),
                delete: vi.fn(),
              }),
            },
            user: {
              where: vi.fn().mockReturnValue({
                first: vi.fn(),
              }),
            },
          },
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
