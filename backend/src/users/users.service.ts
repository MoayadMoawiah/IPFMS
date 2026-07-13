import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RbacService } from '../rbac/rbac.service';
import * as argon2 from 'argon2';
import { buildPaginationResponse, parsePagination } from '../common/dto/pagination.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly rbacSvc: RbacService,
  ) {}

  async findAll(query: any) {
    const { page, limit } = parsePagination(query);
    const { search, isActive } = query;
    const where: any = {
      deletedAt: null,
      ...(isActive !== undefined && { isActive: isActive === 'true' }),
      ...(search && {
        OR: [
          { email: { contains: search, mode: 'insensitive' } },
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true, email: true, firstName: true, lastName: true,
          arabicName: true, phone: true, avatar: true, isActive: true,
          lastLoginAt: true, createdAt: true,
          department: { select: { id: true, name: true } },
          roles: { select: { role: { select: { id: true, name: true, displayName: true } } } },
        },
        skip: (page - 1) * limit, take: limit, orderBy: { firstName: 'asc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return buildPaginationResponse(
      data.map((u) => ({ ...u, roles: u.roles.map((r) => r.role) })),
      total, page, limit
    );
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        arabicName: true, phone: true, avatar: true, isActive: true,
        lastLoginAt: true, createdAt: true, updatedAt: true,
        department: true,
        roles: { select: { role: true, grantedAt: true } },
      },
    });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return { ...user, roles: user.roles.map((r) => ({ ...r.role, grantedAt: r.grantedAt })) };
  }

  async create(dto: any) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already in use');

    const passwordHash = await argon2.hash(dto.password || 'ChangeMe@2026!');

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        arabicName: dto.arabicName,
        phone: dto.phone,
        departmentId: dto.departmentId,
        organizationId: dto.organizationId,
        isActive: dto.isActive !== false,
      },
    });

    if (dto.roleIds?.length > 0) {
      await this.prisma.userRole.createMany({
        data: dto.roleIds.map((roleId: string) => ({ userId: user.id, roleId })),
        skipDuplicates: true,
      });
    }

    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    const existing = await this.findOne(id);

    await this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.firstName && { firstName: dto.firstName }),
        ...(dto.lastName && { lastName: dto.lastName }),
        ...(dto.arabicName !== undefined && { arabicName: dto.arabicName || null }),
        ...(dto.phone !== undefined && { phone: dto.phone || null }),
        ...(dto.departmentId !== undefined && {
          departmentId: dto.departmentId || null,
        }),
        ...(dto.isActive !== undefined && {
          isActive: dto.isActive,
          ...(dto.isActive === false && { refreshTokenHash: null }),
        }),
      },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        arabicName: true, phone: true, isActive: true,
        department: { select: { id: true, name: true } },
      },
    });

    if (dto.roleIds !== undefined) {
      const currentRoleIds = existing.roles.map((r) => r.id);
      const nextRoleIds = dto.roleIds;
      const toAdd = nextRoleIds.filter((roleId) => !currentRoleIds.includes(roleId));
      const toRemove = currentRoleIds.filter((roleId) => !nextRoleIds.includes(roleId));

      if (toAdd.length > 0) {
        await this.prisma.userRole.createMany({
          data: toAdd.map((roleId) => ({ userId: id, roleId })),
          skipDuplicates: true,
        });
      }

      for (const roleId of toRemove) {
        await this.rbacSvc.removeRole(id, roleId);
      }
    }

    return this.findOne(id);
  }

  async activate(id: string) {
    return this.prisma.user.update({ where: { id }, data: { isActive: true } });
  }

  async deactivate(id: string) {
    return this.prisma.user.update({ where: { id }, data: { isActive: false, refreshTokenHash: null } });
  }

  async softDelete(id: string, actorId?: string) {
    if (actorId && actorId === id) {
      throw new BadRequestException('You cannot delete your own account');
    }

    await this.findOne(id);
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false, refreshTokenHash: null },
    });
  }

  async getUserPermissions(id: string) {
    return this.rbacSvc.getUserPermissions(id);
  }

  async assignRole(userId: string, roleId: string, grantedBy: string) {
    return this.rbacSvc.assignRole(userId, roleId, grantedBy);
  }

  async removeRole(userId: string, roleId: string) {
    return this.rbacSvc.removeRole(userId, roleId);
  }
}
