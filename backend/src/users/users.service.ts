import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { Role, User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { PaginationDto, paginate } from '../common/dto/pagination.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(pagination: PaginationDto) {
    const { page = 1, limit = 12 } = pagination;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          avatarUrl: true,
          phoneNumber: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.user.count(),
    ]);

    return paginate(data, total, page, limit);
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        avatarUrl: true,
        phoneNumber: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, dto: UpdateUserDto, requestingUser: User) {
    if (requestingUser.role !== Role.ADMIN && requestingUser.id !== id) {
      throw new ForbiddenException('Cannot update another user');
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        avatarUrl: true,
        phoneNumber: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async changePassword(id: string, dto: ChangePasswordDto, requestingUser: User) {
    if (requestingUser.id !== id) {
      throw new ForbiddenException('Cannot change another user\'s password');
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const valid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!valid) throw new BadRequestException('Current password is incorrect');

    const passwordHash = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({ where: { id }, data: { passwordHash } });

    return { message: 'Password changed successfully' };
  }

  async deactivate(id: string) {
    await this.prisma.user.update({ where: { id }, data: { isActive: false } });
    return { message: 'User deactivated' };
  }

  async updateRole(id: string, role: Role) {
    return this.prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, role: true },
    });
  }
}
