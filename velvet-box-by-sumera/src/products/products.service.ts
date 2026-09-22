import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const category = await this.prisma.category.where({ id: createProductDto.categoryId }).first();
    if (!category) {
      throw new NotFoundException(`Category with ID "${createProductDto.categoryId}" not found`);
    }

    if (createProductDto.collectionId) {
      const col = await this.prisma.collection.where({ id: createProductDto.collectionId }).first();
      if (!col) {
        throw new NotFoundException(`Collection with ID "${createProductDto.collectionId}" not found`);
      }
    }

    return await this.prisma.product.create({
      title: createProductDto.title,
      description: createProductDto.description ?? null,
      price: createProductDto.price,
      stock: createProductDto.stock ?? 0,
      categoryId: createProductDto.categoryId,
      collectionId: createProductDto.collectionId ?? null,
    });
  }

  async findAll(query?: { categoryId?: string; collectionId?: string }) {
    if (query?.collectionId && query?.categoryId) {
      return await this.prisma.product.where({ collectionId: query.collectionId, categoryId: query.categoryId }).all();
    }
    if (query?.collectionId) {
      return await this.prisma.product.where({ collectionId: query.collectionId }).all();
    }
    if (query?.categoryId) {
      return await this.prisma.product.where({ categoryId: query.categoryId }).all();
    }
    return await this.prisma.product.all();
  }

  async findOne(id: string) {
    const product = await this.prisma.product.where({ id }).first();
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.prisma.product.where({ id }).first();
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    if (updateProductDto.categoryId) {
      const category = await this.prisma.category.where({ id: updateProductDto.categoryId }).first();
      if (!category) {
        throw new NotFoundException(`Category with ID "${updateProductDto.categoryId}" not found`);
      }
    }

    if (updateProductDto.collectionId) {
      const col = await this.prisma.collection.where({ id: updateProductDto.collectionId }).first();
      if (!col) {
        throw new NotFoundException(`Collection with ID "${updateProductDto.collectionId}" not found`);
      }
    }

    return await this.prisma.product.where({ id }).update({
      ...updateProductDto,
    });
  }

  async remove(id: string) {
    const product = await this.prisma.product.where({ id }).first();
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    await this.prisma.product.where({ id }).delete();
    return { message: `Product with ID "${id}" successfully removed` };
  }
}
