import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { db } from './db.js';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  [x: string]: any;
  readonly db = db;
  readonly category = this.db.orm.public.Category;

  async onModuleInit() {
    // db connects lazily; nothing to do here
  }

  async onModuleDestroy() {
    // no explicit disconnect needed for @prisma/orm-postgres
  }
}
