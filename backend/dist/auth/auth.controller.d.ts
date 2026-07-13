import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UserPayload } from '../common/decorators/current-user.decorator';
declare class ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto, req: Request): Promise<{
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
    refresh(dto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(user: UserPayload): Promise<{
        message: string;
    }>;
    getMe(user: UserPayload): Promise<{
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
    changePassword(user: UserPayload, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
export {};
