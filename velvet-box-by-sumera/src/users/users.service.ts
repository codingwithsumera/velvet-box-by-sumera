import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { Role } from '../auth/enums/role.enum.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existing = await this.prisma.user.where({ email: createUserDto.email }).first();
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prisma.user.create({
      email: createUserDto.email,
      password: hashedPassword,
      name: createUserDto.name ?? null,
      role: createUserDto.role ?? Role.CUSTOMER,
    });

    const { password: _password, ...result } = user;
    return result;
  }

  async findAll() {
    const users = await this.prisma.user.all();
    return users.map(({ password: _password, ...rest }) => rest);
  }

  async findOne(id: string) {
    const user = await this.prisma.user.where({ id }).first();
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    const { password: _password, ...result } = user;
    return result;
  }

  async findByEmail(email: string) {
    return this.prisma.user.where({ email }).first();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.where({ id }).first();
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    const dataToUpdate: Record<string, any> = { ...updateUserDto };
    if (updateUserDto.password) {
      dataToUpdate['password'] = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updated = await this.prisma.user.where({ id }).update(dataToUpdate);
    if (!updated) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    const { password: _password, ...result } = updated;
    return result;
  }

  async remove(id: string) {
    const user = await this.prisma.user.where({ id }).first();
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    await this.prisma.user.where({ id }).delete();
    return { message: `User with ID "${id}" successfully removed` };
  }
}
