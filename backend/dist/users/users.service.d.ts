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
            department: {
                id: string;
                name: string;
            } | null;
            id: string;
            createdAt: Date;
            email: string;
            firstName: string;
            lastName: string;
            arabicName: string | null;
            phone: string | null;
            avatar: string | null;
            isActive: boolean;
            lastLoginAt: Date | null;
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
            name: string;
            displayName: string | null;
            description: string | null;
            isSystem: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
        department: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            isActive: boolean;
            deletedAt: Date | null;
            parentId: string | null;
            code: string;
            headUserId: string | null;
        } | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        firstName: string;
        lastName: string;
        arabicName: string | null;
        phone: string | null;
        avatar: string | null;
        isActive: boolean;
        lastLoginAt: Date | null;
    }>;
    create(dto: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
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
        deletedAt: Date | null;
    }>;
    update(id: string, dto: UpdateUserDto): Promise<{
        roles: {
            grantedAt: Date;
            id: string;
            name: string;
            displayName: string | null;
            description: string | null;
            isSystem: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
        department: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            isActive: boolean;
            deletedAt: Date | null;
            parentId: string | null;
            code: string;
            headUserId: string | null;
        } | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        firstName: string;
        lastName: string;
        arabicName: string | null;
        phone: string | null;
        avatar: string | null;
        isActive: boolean;
        lastLoginAt: Date | null;
    }>;
    activate(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
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
        deletedAt: Date | null;
    }>;
    deactivate(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
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
