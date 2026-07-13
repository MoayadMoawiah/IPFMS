import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType, NotificationChannel } from '@prisma/client';
import { buildPaginationResponse, parsePagination } from '../common/dto/pagination.dto';

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

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async send(dto: SendNotificationDto) {
    return this.prisma.notification.create({
      data: {
        userId: dto.userId,
        type: dto.type,
        title: dto.title,
        message: dto.message,
        actionUrl: dto.actionUrl,
        documentType: dto.documentType,
        documentId: dto.documentId,
        channel: dto.channel || NotificationChannel.IN_APP,
        sentAt: new Date(),
      },
    });
  }

  async sendToMany(userIds: string[], dto: Omit<SendNotificationDto, 'userId'>) {
    return Promise.all(userIds.map((userId) => this.send({ ...dto, userId })));
  }

  async findForUser(userId: string, query: any) {
    const { page, limit } = parsePagination(query);
    const { isRead } = query;
    const where: any = {
      userId,
      ...(isRead !== undefined && { isRead: isRead === 'true' }),
    };

    const [data, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        skip: (page - 1) * limit, take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where }),
    ]);

    return buildPaginationResponse(data, total, page, limit);
  }

  async markRead(id: string, userId: string) {
    return this.prisma.notification.update({
      where: { id, userId },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async markAllRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
    return { success: true };
  }

  async getUnreadCount(userId: string) {
    const count = await this.prisma.notification.count({ where: { userId, isRead: false } });
    return { count };
  }
}
