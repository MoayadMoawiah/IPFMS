import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RbacService } from '../rbac/rbac.service';
import * as argon2 from 'argon2';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly rbacService: RbacService,
  ) {}

  async login(dto: LoginDto, ipAddress: string, userAgent: string) {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim(), deletedAt: null } as any,
      include: {
        roles: {
          include: { role: true },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new ForbiddenException('Account is deactivated. Contact your administrator.');
    }

    // Verify password
    const isPasswordValid = await argon2.verify(user.passwordHash, dto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Extract role names and permissions
    const roles = (user.roles as any[]).map((ur) => ur.role.name as string);
    const permissions = await this.rbacService.getUserPermissions(user.id);

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email, roles);

    // Store refresh token hash
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

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub, deletedAt: null },
        include: { roles: { include: { role: true } } },
      });

      if (!user || !user.refreshTokenHash || !user.isActive) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Verify the stored hash matches
      const isValid = await argon2.verify(user.refreshTokenHash, refreshToken);
      if (!isValid) {
        throw new UnauthorizedException('Refresh token has been revoked');
      }

      const roles = user.roles.map((ur) => ur.role.name);
      const tokens = await this.generateTokens(user.id, user.email, roles);

      // Rotate: update stored refresh token hash
      const newHash = await argon2.hash(tokens.refreshToken);
      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshTokenHash: newHash },
      });

      return tokens;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    });
    return { message: 'Logged out successfully' };
  }

  async getMe(userId: string) {
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
      throw new UnauthorizedException('User not found');
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

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    if (newPassword.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { passwordHash: true },
    });

    if (!user) throw new UnauthorizedException();

    const isValid = await argon2.verify(user.passwordHash, currentPassword);
    if (!isValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const newHash = await argon2.hash(newPassword);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash, refreshTokenHash: null },
    });

    return { message: 'Password changed successfully. Please log in again.' };
  }

  private async generateTokens(userId: string, email: string, roles: string[]) {
    const payload = { sub: userId, email, roles };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('JWT_SECRET'),
        expiresIn: this.config.get<string>('JWT_EXPIRES_IN', '15m'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
