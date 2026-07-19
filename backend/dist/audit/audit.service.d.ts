import { PrismaService } from '../prisma/prisma.service';
import { AuditAction } from '@prisma/client';
export interface AuditLogDto {
    userId?: string;
    userEmail?: string;
    action: AuditAction;
    module: string;
    resource: string;
    resourceId?: string;
    oldValues?: any;
    newValues?: any;
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
    requestId?: string;
    duration?: number;
}
export declare class AuditService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    log(dto: AuditLogDto): Promise<void>;
    findAll(filters: {
        userId?: string;
        module?: string;
        resource?: string;
        resourceId?: string;
        action?: AuditAction;
        startDate?: Date;
        endDate?: Date;
        page?: number;
        limit?: number;
    }): Promise<{
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
