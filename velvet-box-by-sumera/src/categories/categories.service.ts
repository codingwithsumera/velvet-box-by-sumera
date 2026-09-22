import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return await this.prisma.category.create(createCategoryDto);
  }

  async findAll() {
    return this.prisma.category.all();
  }

  findOne(id: string) {
    return this.prisma.category.where({ id }).first();
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.prisma.category.where({ id }).update({
      ...updateCategoryDto,
    });
  }

  remove(id: string) {
    return this.prisma.category.where({ id }).delete();
  }
}
