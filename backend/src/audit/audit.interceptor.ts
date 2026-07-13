import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';
import { AuditService } from './audit.service';
import { AuditAction } from '@prisma/client';

export const AUDIT_KEY = 'audit';

export interface AuditMeta {
  module: string;
  resource: string;
  action: AuditAction;
}

export const Audit = (meta: AuditMeta) => {
  const { SetMetadata } = require('@nestjs/common');
  return SetMetadata(AUDIT_KEY, meta);
};

/**
 * Automatically infers audit action from HTTP method when @Audit() decorator is present.
 * Can be applied globally or per-route.
 */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly auditService: AuditService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const auditMeta = this.reflector.getAllAndOverride<AuditMeta>(AUDIT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!auditMeta) return next.handle();

    const request = context.switchToHttp().getRequest<Request>();
    const user = (request as any).user;
    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: (responseData) => {
          const duration = Date.now() - start;
          const resourceId = request.params?.id || responseData?.data?.id || responseData?.id;

          this.auditService
            .log({
              userId: user?.id,
              userEmail: user?.email,
              action: auditMeta.action,
              module: auditMeta.module,
              resource: auditMeta.resource,
              resourceId,
              newValues: ['POST', 'PATCH', 'PUT'].includes(request.method) ? request.body : undefined,
              ipAddress: request.ip,
              userAgent: request.headers['user-agent'],
              duration,
            })
            .catch(() => {});
        },
        error: () => {
          const duration = Date.now() - start;
          this.auditService
            .log({
              userId: user?.id,
              userEmail: user?.email,
              action: auditMeta.action,
              module: auditMeta.module,
              resource: auditMeta.resource,
              ipAddress: request.ip,
              userAgent: request.headers['user-agent'],
              duration,
            })
            .catch(() => {});
        },
      }),
    );
  }
}
