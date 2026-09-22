import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { db } from './db.js';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  [x: string]: any;
  readonly db = db;
  readonly category = this.db.orm.public.Category;
  readonly product = this.db.orm.public.Product;
  readonly order = this.db.orm.public.Order;
  readonly user = this.db.orm.public.User;
  readonly collection = this.db.orm.public.Collection;

  async onModuleInit() {
    // db connects lazily; nothing to do here
  }

  async onModuleDestroy() {
    // no explicit disconnect needed for @prisma/orm-postgres
  }
}
