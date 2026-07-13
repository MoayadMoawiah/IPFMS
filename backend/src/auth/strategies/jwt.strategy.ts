import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { UserPayload } from '../../common/decorators/current-user.decorator';

interface JwtPayload {
  sub: string;
  email: string;
  roles: string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: any, payload: JwtPayload): Promise<UserPayload> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub, deletedAt: null },
      select: { id: true, email: true, isActive: true },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User account is inactive or not found');
    }

    return {
      id: payload.sub,
      email: payload.email,
      roles: payload.roles,
      ipAddress: request.ip || request.connection?.remoteAddress,
      userAgent: request.headers?.['user-agent'],
    };
  }
}
