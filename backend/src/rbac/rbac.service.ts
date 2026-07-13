import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface CachedPermissions {
  permissions: string[];
  cachedAt: number;
}

@Injectable()
export class RbacService {
  private readonly logger = new Logger(RbacService.name);
  private readonly cache = new Map<string, CachedPermissions>();
  private readonly CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Check if a user has ALL of the specified permissions.
   * Permission format: "MODULE:ACTION" e.g. "PROCUREMENT:CREATE"
   */
  async userHasPermissions(userId: string, requiredPermissions: string[]): Promise<boolean> {
    const userPermissions = await this.getUserPermissions(userId);

    return requiredPermissions.every((required) => {
      const [module, action] = required.toUpperCase().split(':');
      // Check exact match or SUPER_ADMIN bypass
      return (
        userPermissions.includes(`${module}:${action}`) ||
        userPermissions.includes('*:*') ||
        userPermissions.includes(`${module}:*`)
      );
    });
  }

  private isSuperAdminRole(roleName: string): boolean {
    const normalized = roleName.trim().toUpperCase().replace(/\s+/g, '_');
    return normalized === 'SUPER_ADMIN';
  }

  /**
   * Get all permissions for a user (from all their roles).
   * Cached per user for CACHE_TTL_MS.
   */
  async getUserPermissions(userId: string): Promise<string[]> {
    const cached = this.cache.get(userId);
    if (cached && Date.now() - cached.cachedAt < this.CACHE_TTL_MS) {
      return cached.permissions;
    }

    // Load from DB
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

    const permissions = new Set<string>();

    for (const ur of userRoles) {
      // Super admin gets wildcard
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

  /**
   * Get user's role names
   */
  async getUserRoles(userId: string): Promise<string[]> {
    const userRoles = await this.prisma.userRole.findMany({
      where: { userId },
      select: { role: { select: { name: true } } },
    });
    return userRoles.map((ur) => ur.role.name);
  }

  /**
   * Invalidate cache for a user (call when roles change)
   */
  invalidateCache(userId: string) {
    this.cache.delete(userId);
  }

  /**
   * Assign a role to a user
   */
  async assignRole(userId: string, roleId: string, grantedBy: string) {
    const result = await this.prisma.userRole.upsert({
      where: { userId_roleId: { userId, roleId } },
      update: {},
      create: { userId, roleId, grantedBy },
    });
    this.invalidateCache(userId);
    return result;
  }

  /**
   * Remove a role from a user
   */
  async removeRole(userId: string, roleId: string) {
    await this.prisma.userRole.delete({
      where: { userId_roleId: { userId, roleId } },
    });
    this.invalidateCache(userId);
  }

  /**
   * Get all roles with their permissions
   */
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

  /**
   * Create a new role
   */
  async createRole(data: { name: string; displayName: string; description?: string }) {
    return this.prisma.role.create({ data });
  }

  /**
   * Assign permissions to a role
   */
  async setRolePermissions(roleId: string, permissionIds: string[]) {
    await this.prisma.rolePermission.deleteMany({ where: { roleId } });
    if (permissionIds.length > 0) {
      await this.prisma.rolePermission.createMany({
        data: permissionIds.map((permissionId) => ({ roleId, permissionId })),
        skipDuplicates: true,
      });
    }
    // Invalidate all user caches for this role
    const users = await this.prisma.userRole.findMany({
      where: { roleId },
      select: { userId: true },
    });
    users.forEach((u) => this.invalidateCache(u.userId));
  }

  /**
   * List all permissions
   */
  async getAllPermissions() {
    return this.prisma.permission.findMany({ orderBy: [{ module: 'asc' }, { action: 'asc' }] });
  }
}
