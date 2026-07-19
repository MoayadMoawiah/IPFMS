import { PrismaService } from '../prisma/prisma.service';
export declare class RbacService {
    private readonly prisma;
    private readonly logger;
    private readonly cache;
    private readonly CACHE_TTL_MS;
    constructor(prisma: PrismaService);
    userHasPermissions(userId: string, requiredPermissions: string[]): Promise<boolean>;
    private isSuperAdminRole;
    getUserPermissions(userId: string): Promise<string[]>;
    getUserRoles(userId: string): Promise<string[]>;
    invalidateCache(userId: string): void;
    assignRole(userId: string, roleId: string, grantedBy: string): Promise<{
        userId: string;
        roleId: string;
        grantedBy: string | null;
        grantedAt: Date;
    }>;
    removeRole(userId: string, roleId: string): Promise<void>;
    getAllRoles(): Promise<({
        rolePermissions: ({
            permission: {
                id: string;
                description: string | null;
                createdAt: Date;
                module: import(".prisma/client").$Enums.PermissionModule;
                action: import(".prisma/client").$Enums.PermissionAction;
                resource: string | null;
            };
        } & {
            roleId: string;
            permissionId: string;
        })[];
        _count: {
            userRoles: number;
        };
    } & {
        id: string;
        name: string;
        displayName: string | null;
        description: string | null;
        isSystem: boolean;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    createRole(data: {
        name: string;
        displayName: string;
        description?: string;
    }): Promise<{
        id: string;
        name: string;
        displayName: string | null;
        description: string | null;
        isSystem: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    setRolePermissions(roleId: string, permissionIds: string[]): Promise<void>;
    getAllPermissions(): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        module: import(".prisma/client").$Enums.PermissionModule;
        action: import(".prisma/client").$Enums.PermissionAction;
        resource: string | null;
    }[]>;
}
