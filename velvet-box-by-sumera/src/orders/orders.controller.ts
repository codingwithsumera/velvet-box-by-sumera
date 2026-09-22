import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../auth/enums/role.enum.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles(Role.CUSTOMER, Role.ADMIN)
  create(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() user: { id: string; role: Role },
  ) {
    return this.ordersService.create(user.id, createOrderDto, user.role);
  }

  @Get()
  @Roles(Role.CUSTOMER, Role.ADMIN)
  findAll(@CurrentUser() user: { id: string; role: Role }) {
    return this.ordersService.findAll(user);
  }

  @Get(':id')
  @Roles(Role.CUSTOMER, Role.ADMIN)
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: { id: string; role: Role },
  ) {
    return this.ordersService.findOne(id, user);
  }

  @Patch(':id')
  @Roles(Role.CUSTOMER, Role.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @CurrentUser() user: { id: string; role: Role },
  ) {
    return this.ordersService.update(id, updateOrderDto, user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
