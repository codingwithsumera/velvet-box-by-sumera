import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';
import { Role } from '../auth/enums/role.enum.js';
import { OrderStatus } from './enums/order-status.enum.js';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createOrderDto: CreateOrderDto, role?: Role) {
    const targetUserId = role === Role.ADMIN && createOrderDto.userId ? createOrderDto.userId : userId;

    const user = await this.prisma.user.where({ id: targetUserId }).first();
    if (!user) {
      throw new NotFoundException(`User with ID "${targetUserId}" not found`);
    }

    return await this.prisma.order.create({
      total: createOrderDto.total,
      status: createOrderDto.status ?? OrderStatus.PENDING,
      userId: targetUserId,
    });
  }

  async findAll(user: { id: string; role: Role }) {
    if (user.role === Role.ADMIN) {
      return await this.prisma.order.all();
    }
    return await this.prisma.order.where({ userId: user.id }).all();
  }

  async findOne(id: string, user: { id: string; role: Role }) {
    const order = await this.prisma.order.where({ id }).first();
    if (!order) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }

    if (user.role !== Role.ADMIN && order.userId !== user.id) {
      throw new ForbiddenException('You do not have permission to view this order');
    }

    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto, user: { id: string; role: Role }) {
    const order = await this.prisma.order.where({ id }).first();
    if (!order) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }

    if (user.role !== Role.ADMIN && order.userId !== user.id) {
      throw new ForbiddenException('You do not have permission to update this order');
    }

    // Customers can only cancel an order if it's still pending
    if (user.role !== Role.ADMIN) {
      if (updateOrderDto.status && updateOrderDto.status !== OrderStatus.CANCELLED) {
        throw new ForbiddenException('Customers can only cancel pending orders');
      }
      if (order.status !== OrderStatus.PENDING) {
        throw new ForbiddenException('Only pending orders can be cancelled');
      }
    }

    return await this.prisma.order.where({ id }).update({
      ...updateOrderDto,
    });
  }

  async remove(id: string) {
    const order = await this.prisma.order.where({ id }).first();
    if (!order) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }

    await this.prisma.order.where({ id }).delete();
    return { message: `Order with ID "${id}" successfully removed` };
  }
}
