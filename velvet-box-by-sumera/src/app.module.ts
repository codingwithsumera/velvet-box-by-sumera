import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { CategoriesModule } from './categories/categories.module.js';
import { ProductsModule } from './products/products.module.js';
import { UsersModule } from './users/users.module.js';
import { OrdersModule } from './orders/orders.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { OrdersController } from './orders/orders.controller.js';
import { UsersController } from './users/users.controller.js';
import { ProductsController } from './products/products.controller.js';
import { OrdersService } from './orders/orders.service.js';
import { UsersService } from './users/users.service.js';
import { ProductsService } from './products/products.service.js';
import { CategoriesController } from './categories/categories.controller.js';
import { CategoriesService } from './categories/categories.service.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'velvet-box-by-sumera',
    }),
    PrismaModule,
    AuthModule,
    CategoriesModule,
    ProductsModule,
    UsersModule,
    OrdersModule,
  ],
  controllers: [AppController, OrdersController, UsersController, ProductsController, CategoriesController],
  providers: [AppService, OrdersService, CategoriesService, UsersService, ProductsService, OrdersService],
})
export class AppModule { }
