import { RbacService } from './rbac.service';
export declare class RbacController {
    private readonly rbacService;
    constructor(rbacService: RbacService);
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
    setRolePermissions(roleId: string, data: {
        permissionIds: string[];
    }): Promise<void>;
    getAllPermissions(): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        module: import(".prisma/client").$Enums.PermissionModule;
        action: import(".prisma/client").$Enums.PermissionAction;
        resource: string | null;
    }[]>;
}
