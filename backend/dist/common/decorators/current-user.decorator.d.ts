export interface UserPayload {
    id: string;
    email: string;
    roles: string[];
    ipAddress?: string;
    userAgent?: string;
}
export declare const CurrentUser: (...dataOrPipes: (keyof UserPayload | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>> | undefined)[]) => ParameterDecorator;
