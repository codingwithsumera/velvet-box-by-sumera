import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { OrderStatus } from '../enums/order-status.enum.js';

export class CreateOrderDto {
  @IsNumber({}, { message: 'Total must be a number' })
  @IsNotEmpty()
  @Min(0, { message: 'Total cannot be negative' })
  total: number;

  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @IsString()
  @IsOptional()
  userId?: string;
}
