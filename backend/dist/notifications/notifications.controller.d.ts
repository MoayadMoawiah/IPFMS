import { NotificationsService } from './notifications.service';
import { UserPayload } from '../common/decorators/current-user.decorator';
export declare class NotificationsController {
    private readonly svc;
    constructor(svc: NotificationsService);
    findAll(user: UserPayload, q: any): Promise<{
        data: {
            userId: string;
            id: string;
            createdAt: Date;
            type: import(".prisma/client").$Enums.NotificationType;
            title: string;
            message: string;
            documentType: string | null;
            documentId: string | null;
            actionUrl: string | null;
            isRead: boolean;
            readAt: Date | null;
            channel: import(".prisma/client").$Enums.NotificationChannel;
            sentAt: Date | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getCount(user: UserPayload): Promise<{
        count: number;
    }>;
    markRead(id: string, user: UserPayload): Promise<{
        userId: string;
        id: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        message: string;
        documentType: string | null;
        documentId: string | null;
        actionUrl: string | null;
        isRead: boolean;
        readAt: Date | null;
        channel: import(".prisma/client").$Enums.NotificationChannel;
        sentAt: Date | null;
    }>;
    markAllRead(user: UserPayload): Promise<{
        success: boolean;
    }>;
}
