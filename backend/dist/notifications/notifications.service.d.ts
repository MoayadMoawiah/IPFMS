import { PrismaService } from '../prisma/prisma.service';
import { NotificationType, NotificationChannel } from '@prisma/client';
export interface SendNotificationDto {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    actionUrl?: string;
    documentType?: string;
    documentId?: string;
    channel?: NotificationChannel;
}
export declare class NotificationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    send(dto: SendNotificationDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        type: import(".prisma/client").$Enums.NotificationType;
        documentType: string | null;
        documentId: string | null;
        title: string;
        message: string;
        actionUrl: string | null;
        isRead: boolean;
        readAt: Date | null;
        channel: import(".prisma/client").$Enums.NotificationChannel;
        sentAt: Date | null;
    }>;
    sendToMany(userIds: string[], dto: Omit<SendNotificationDto, 'userId'>): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        type: import(".prisma/client").$Enums.NotificationType;
        documentType: string | null;
        documentId: string | null;
        title: string;
        message: string;
        actionUrl: string | null;
        isRead: boolean;
        readAt: Date | null;
        channel: import(".prisma/client").$Enums.NotificationChannel;
        sentAt: Date | null;
    }[]>;
    findForUser(userId: string, query: any): Promise<{
        data: {
            id: string;
            createdAt: Date;
            userId: string;
            type: import(".prisma/client").$Enums.NotificationType;
            documentType: string | null;
            documentId: string | null;
            title: string;
            message: string;
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
    markRead(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        type: import(".prisma/client").$Enums.NotificationType;
        documentType: string | null;
        documentId: string | null;
        title: string;
        message: string;
        actionUrl: string | null;
        isRead: boolean;
        readAt: Date | null;
        channel: import(".prisma/client").$Enums.NotificationChannel;
        sentAt: Date | null;
    }>;
    markAllRead(userId: string): Promise<{
        success: boolean;
    }>;
    getUnreadCount(userId: string): Promise<{
        count: number;
    }>;
}
