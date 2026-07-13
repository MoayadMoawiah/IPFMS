"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const rbac_service_1 = require("../rbac/rbac.service");
const argon2 = require("argon2");
const pagination_dto_1 = require("../common/dto/pagination.dto");
let UsersService = class UsersService {
    constructor(prisma, rbacSvc) {
        this.prisma = prisma;
        this.rbacSvc = rbacSvc;
    }
    async findAll(query) {
        const { page, limit } = (0, pagination_dto_1.parsePagination)(query);
        const { search, isActive } = query;
        const where = {
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
        return (0, pagination_dto_1.buildPaginationResponse)(data.map((u) => ({ ...u, roles: u.roles.map((r) => r.role) })), total, page, limit);
    }
    async findOne(id) {
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
        if (!user)
            throw new common_1.NotFoundException(`User ${id} not found`);
        return { ...user, roles: user.roles.map((r) => ({ ...r.role, grantedAt: r.grantedAt })) };
    }
    async create(dto) {
        const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existing)
            throw new common_1.ConflictException('Email already in use');
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
                data: dto.roleIds.map((roleId) => ({ userId: user.id, roleId })),
                skipDuplicates: true,
            });
        }
        return user;
    }
    async update(id, dto) {
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
    async activate(id) {
        return this.prisma.user.update({ where: { id }, data: { isActive: true } });
    }
    async deactivate(id) {
        return this.prisma.user.update({ where: { id }, data: { isActive: false, refreshTokenHash: null } });
    }
    async softDelete(id, actorId) {
        if (actorId && actorId === id) {
            throw new common_1.BadRequestException('You cannot delete your own account');
        }
        await this.findOne(id);
        await this.prisma.user.update({
            where: { id },
            data: { deletedAt: new Date(), isActive: false, refreshTokenHash: null },
        });
    }
    async getUserPermissions(id) {
        return this.rbacSvc.getUserPermissions(id);
    }
    async assignRole(userId, roleId, grantedBy) {
        return this.rbacSvc.assignRole(userId, roleId, grantedBy);
    }
    async removeRole(userId, roleId) {
        return this.rbacSvc.removeRole(userId, roleId);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        rbac_service_1.RbacService])
], UsersService);
//# sourceMappingURL=users.service.js.map