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
var RbacService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RbacService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let RbacService = RbacService_1 = class RbacService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(RbacService_1.name);
        this.cache = new Map();
        this.CACHE_TTL_MS = 5 * 60 * 1000;
    }
    async userHasPermissions(userId, requiredPermissions) {
        const userPermissions = await this.getUserPermissions(userId);
        return requiredPermissions.every((required) => {
            const [module, action] = required.toUpperCase().split(':');
            return (userPermissions.includes(`${module}:${action}`) ||
                userPermissions.includes('*:*') ||
                userPermissions.includes(`${module}:*`));
        });
    }
    isSuperAdminRole(roleName) {
        const normalized = roleName.trim().toUpperCase().replace(/\s+/g, '_');
        return normalized === 'SUPER_ADMIN';
    }
    async getUserPermissions(userId) {
        const cached = this.cache.get(userId);
        if (cached && Date.now() - cached.cachedAt < this.CACHE_TTL_MS) {
            return cached.permissions;
        }
        const userRoles = await this.prisma.userRole.findMany({
            where: { userId },
            select: {
                role: {
                    select: {
                        name: true,
                        rolePermissions: {
                            select: {
                                permission: {
                                    select: { module: true, action: true },
                                },
                            },
                        },
                    },
                },
            },
        });
        const permissions = new Set();
        for (const ur of userRoles) {
            if (this.isSuperAdminRole(ur.role.name)) {
                permissions.add('*:*');
                break;
            }
            for (const rp of ur.role.rolePermissions) {
                permissions.add(`${rp.permission.module}:${rp.permission.action}`);
            }
        }
        const permissionArray = Array.from(permissions);
        this.cache.set(userId, { permissions: permissionArray, cachedAt: Date.now() });
        return permissionArray;
    }
    async getUserRoles(userId) {
        const userRoles = await this.prisma.userRole.findMany({
            where: { userId },
            select: { role: { select: { name: true } } },
        });
        return userRoles.map((ur) => ur.role.name);
    }
    invalidateCache(userId) {
        this.cache.delete(userId);
    }
    async assignRole(userId, roleId, grantedBy) {
        const result = await this.prisma.userRole.upsert({
            where: { userId_roleId: { userId, roleId } },
            update: {},
            create: { userId, roleId, grantedBy },
        });
        this.invalidateCache(userId);
        return result;
    }
    async removeRole(userId, roleId) {
        await this.prisma.userRole.delete({
            where: { userId_roleId: { userId, roleId } },
        });
        this.invalidateCache(userId);
    }
    async getAllRoles() {
        return this.prisma.role.findMany({
            include: {
                rolePermissions: {
                    include: { permission: true },
                },
                _count: { select: { userRoles: true } },
            },
            orderBy: { name: 'asc' },
        });
    }
    async createRole(data) {
        return this.prisma.role.create({ data });
    }
    async setRolePermissions(roleId, permissionIds) {
        await this.prisma.rolePermission.deleteMany({ where: { roleId } });
        if (permissionIds.length > 0) {
            await this.prisma.rolePermission.createMany({
                data: permissionIds.map((permissionId) => ({ roleId, permissionId })),
                skipDuplicates: true,
            });
        }
        const users = await this.prisma.userRole.findMany({
            where: { roleId },
            select: { userId: true },
        });
        users.forEach((u) => this.invalidateCache(u.userId));
    }
    async getAllPermissions() {
        return this.prisma.permission.findMany({ orderBy: [{ module: 'asc' }, { action: 'asc' }] });
    }
};
exports.RbacService = RbacService;
exports.RbacService = RbacService = RbacService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RbacService);
//# sourceMappingURL=rbac.service.js.map