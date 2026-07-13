import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RbacService } from '../rbac/rbac.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly config;
    private readonly rbacService;
    constructor(prisma: PrismaService, jwtService: JwtService, config: ConfigService, rbacService: RbacService);
    login(dto: LoginDto, ipAddress: string, userAgent: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            arabicName: string | null;
            avatar: string | null;
            roles: string[];
            permissions: string[];
            departmentId: string | null;
        };
    }>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    getMe(userId: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        arabicName: string | null;
        phone: string | null;
        avatar: string | null;
        isActive: boolean;
        lastLoginAt: Date | null;
        department: {
            id: string;
            name: string;
            code: string;
        } | null;
        roles: string[];
        permissions: string[];
    }>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
    private generateTokens;
}
