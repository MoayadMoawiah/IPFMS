import { PrismaService } from '../prisma/prisma.service';
import { RbacService } from '../rbac/rbac.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private readonly prisma;
    private readonly rbacSvc;
    constructor(prisma: PrismaService, rbacSvc: RbacService);
    findAll(query: any): Promise<{
        data: {
            roles: {
                id: string;
                name: string;
                displayName: string | null;
            }[];
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            arabicName: string | null;
            phone: string | null;
            avatar: string | null;
            isActive: boolean;
            lastLoginAt: Date | null;
            createdAt: Date;
            department: {
                id: string;
                name: string;
            } | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        roles: {
            grantedAt: Date;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            displayName: string | null;
            isSystem: boolean;
        }[];
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        arabicName: string | null;
        phone: string | null;
        avatar: string | null;
        isActive: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        department: {
            id: string;
            organizationId: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            parentId: string | null;
            name: string;
            code: string;
            description: string | null;
            headUserId: string | null;
        } | null;
    }>;
    create(dto: any): Promise<{
        id: string;
        email: string;
        passwordHash: string;
        firstName: string;
        lastName: string;
        arabicName: string | null;
        phone: string | null;
        avatar: string | null;
        organizationId: string | null;
        departmentId: string | null;
        isActive: boolean;
        isEmailVerified: boolean;
        lastLoginAt: Date | null;
        lastLoginIp: string | null;
        refreshTokenHash: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    update(id: string, dto: UpdateUserDto): Promise<{
        roles: {
            grantedAt: Date;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            displayName: string | null;
            isSystem: boolean;
        }[];
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        arabicName: string | null;
        phone: string | null;
        avatar: string | null;
        isActive: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        department: {
            id: string;
            organizationId: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            parentId: string | null;
            name: string;
            code: string;
            description: string | null;
            headUserId: string | null;
        } | null;
    }>;
    activate(id: string): Promise<{
        id: string;
        email: string;
        passwordHash: string;
        firstName: string;
        lastName: string;
        arabicName: string | null;
        phone: string | null;
        avatar: string | null;
        organizationId: string | null;
        departmentId: string | null;
        isActive: boolean;
        isEmailVerified: boolean;
        lastLoginAt: Date | null;
        lastLoginIp: string | null;
        refreshTokenHash: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    deactivate(id: string): Promise<{
        id: string;
        email: string;
        passwordHash: string;
        firstName: string;
        lastName: string;
        arabicName: string | null;
        phone: string | null;
        avatar: string | null;
        organizationId: string | null;
        departmentId: string | null;
        isActive: boolean;
        isEmailVerified: boolean;
        lastLoginAt: Date | null;
        lastLoginIp: string | null;
        refreshTokenHash: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    softDelete(id: string, actorId?: string): Promise<void>;
    getUserPermissions(id: string): Promise<string[]>;
    assignRole(userId: string, roleId: string, grantedBy: string): Promise<{
        userId: string;
        roleId: string;
        grantedBy: string | null;
        grantedAt: Date;
    }>;
    removeRole(userId: string, roleId: string): Promise<void>;
}
