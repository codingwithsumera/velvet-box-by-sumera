import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller.js';
import { OrdersService } from './orders.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { vi, describe, beforeEach, it, expect } from 'vitest';

describe('OrdersController', () => {
  let controller: OrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
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

    controller = module.get<OrdersController>(OrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
