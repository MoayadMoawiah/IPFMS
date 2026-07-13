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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const rbac_service_1 = require("../rbac/rbac.service");
const argon2 = require("argon2");
let AuthService = class AuthService {
    constructor(prisma, jwtService, config, rbacService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.config = config;
        this.rbacService = rbacService;
    }
    async login(dto, ipAddress, userAgent) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase().trim(), deletedAt: null },
            include: {
                roles: {
                    include: { role: true },
                },
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        if (!user.isActive) {
            throw new common_1.ForbiddenException('Account is deactivated. Contact your administrator.');
        }
        const isPasswordValid = await argon2.verify(user.passwordHash, dto.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const roles = user.roles.map((ur) => ur.role.name);
        const permissions = await this.rbacService.getUserPermissions(user.id);
        const tokens = await this.generateTokens(user.id, user.email, roles);
        const refreshTokenHash = await argon2.hash(tokens.refreshToken);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                refreshTokenHash,
                lastLoginAt: new Date(),
                lastLoginIp: ipAddress,
            },
        });
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                arabicName: user.arabicName,
                avatar: user.avatar,
                roles,
                permissions,
                departmentId: user.departmentId,
            },
        };
    }
    async refresh(refreshToken) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.config.get('JWT_REFRESH_SECRET'),
            });
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub, deletedAt: null },
                include: { roles: { include: { role: true } } },
            });
            if (!user || !user.refreshTokenHash || !user.isActive) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            const isValid = await argon2.verify(user.refreshTokenHash, refreshToken);
            if (!isValid) {
                throw new common_1.UnauthorizedException('Refresh token has been revoked');
            }
            const roles = user.roles.map((ur) => ur.role.name);
            const tokens = await this.generateTokens(user.id, user.email, roles);
            const newHash = await argon2.hash(tokens.refreshToken);
            await this.prisma.user.update({
                where: { id: user.id },
                data: { refreshTokenHash: newHash },
            });
            return tokens;
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException)
                throw error;
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
    }
    async logout(userId) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshTokenHash: null },
        });
        return { message: 'Logged out successfully' };
    }
    async getMe(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId, deletedAt: null },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                arabicName: true,
                phone: true,
                avatar: true,
                isActive: true,
                lastLoginAt: true,
                department: { select: { id: true, name: true, code: true } },
                roles: {
                    select: {
                        role: {
                            select: {
                                id: true,
                                name: true,
                                displayName: true,
                            },
                        },
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const roles = user.roles.map((ur) => ur.role.name);
        const permissions = await this.rbacService.getUserPermissions(userId);
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            arabicName: user.arabicName,
            phone: user.phone,
            avatar: user.avatar,
            isActive: user.isActive,
            lastLoginAt: user.lastLoginAt,
            department: user.department,
            roles,
            permissions,
        };
    }
    async changePassword(userId, currentPassword, newPassword) {
        if (newPassword.length < 8) {
            throw new common_1.BadRequestException('Password must be at least 8 characters');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { passwordHash: true },
        });
        if (!user)
            throw new common_1.UnauthorizedException();
        const isValid = await argon2.verify(user.passwordHash, currentPassword);
        if (!isValid) {
            throw new common_1.UnauthorizedException('Current password is incorrect');
        }
        const newHash = await argon2.hash(newPassword);
        await this.prisma.user.update({
            where: { id: userId },
            data: { passwordHash: newHash, refreshTokenHash: null },
        });
        return { message: 'Password changed successfully. Please log in again.' };
    }
    async generateTokens(userId, email, roles) {
        const payload = { sub: userId, email, roles };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.config.get('JWT_SECRET'),
                expiresIn: this.config.get('JWT_EXPIRES_IN', '15m'),
            }),
            this.jwtService.signAsync(payload, {
                secret: this.config.get('JWT_REFRESH_SECRET'),
                expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '7d'),
            }),
        ]);
        return { accessToken, refreshToken };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService,
        rbac_service_1.RbacService])
], AuthService);
//# sourceMappingURL=auth.service.js.map