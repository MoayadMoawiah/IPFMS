import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserPayload } from '../common/decorators/current-user.decorator';
export declare class UsersController {
    private readonly svc;
    constructor(svc: UsersService);
    findAll(q: any): Promise<{
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
    remove(id: string, user: UserPayload): Promise<void>;
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
    getPermissions(id: string): Promise<string[]>;
    assignRole(id: string, body: {
        roleId: string;
    }, user: UserPayload): Promise<{
        userId: string;
        roleId: string;
        grantedBy: string | null;
        grantedAt: Date;
    }>;
    removeRole(id: string, roleId: string): Promise<void>;
}
