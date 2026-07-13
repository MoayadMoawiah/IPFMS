import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { UserPayload } from '../../common/decorators/current-user.decorator';
interface JwtPayload {
    sub: string;
    email: string;
    roles: string[];
}
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly prisma;
    constructor(config: ConfigService, prisma: PrismaService);
    validate(request: any, payload: JwtPayload): Promise<UserPayload>;
}
export {};
