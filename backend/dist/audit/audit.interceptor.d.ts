import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AuditService } from './audit.service';
import { AuditAction } from '@prisma/client';
export declare const AUDIT_KEY = "audit";
export interface AuditMeta {
    module: string;
    resource: string;
    action: AuditAction;
}
export declare const Audit: (meta: AuditMeta) => any;
export declare class AuditInterceptor implements NestInterceptor {
    private readonly auditService;
    private readonly reflector;
    constructor(auditService: AuditService, reflector: Reflector);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
