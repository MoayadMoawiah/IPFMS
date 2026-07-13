import { AuditService } from './audit.service';
import { AuditAction } from '@prisma/client';
export declare class AuditController {
    private readonly auditService;
    constructor(auditService: AuditService);
    findAll(userId?: string, module?: string, resource?: string, action?: AuditAction, startDate?: string, endDate?: string, page?: number, limit?: number): Promise<{
        data: ({
            user: {
                email: string;
                firstName: string;
                lastName: string;
            } | null;
        } & {
            userId: string | null;
            id: string;
            createdAt: Date;
            module: string;
            action: import(".prisma/client").$Enums.AuditAction;
            resource: string;
            ipAddress: string | null;
            userAgent: string | null;
            userEmail: string | null;
            resourceId: string | null;
            oldValues: import(".prisma/client/runtime/library").JsonValue | null;
            newValues: import(".prisma/client/runtime/library").JsonValue | null;
            sessionId: string | null;
            requestId: string | null;
            duration: number | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findByDocument(documentType: string, documentId: string): Promise<({
        user: {
            email: string;
            firstName: string;
            lastName: string;
        } | null;
    } & {
        userId: string | null;
        id: string;
        createdAt: Date;
        module: string;
        action: import(".prisma/client").$Enums.AuditAction;
        resource: string;
        ipAddress: string | null;
        userAgent: string | null;
        userEmail: string | null;
        resourceId: string | null;
        oldValues: import(".prisma/client/runtime/library").JsonValue | null;
        newValues: import(".prisma/client/runtime/library").JsonValue | null;
        sessionId: string | null;
        requestId: string | null;
        duration: number | null;
    })[]>;
}
