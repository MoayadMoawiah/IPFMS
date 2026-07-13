"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const pagination_dto_1 = require("../common/dto/pagination.dto");
let NotificationsService = class NotificationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async send(dto) {
        return this.prisma.notification.create({
            data: {
                userId: dto.userId,
                type: dto.type,
                title: dto.title,
                message: dto.message,
                actionUrl: dto.actionUrl,
                documentType: dto.documentType,
                documentId: dto.documentId,
                channel: dto.channel || client_1.NotificationChannel.IN_APP,
                sentAt: new Date(),
            },
        });
    }
    async sendToMany(userIds, dto) {
        return Promise.all(userIds.map((userId) => this.send({ ...dto, userId })));
    }
    async findForUser(userId, query) {
        const { page, limit } = (0, pagination_dto_1.parsePagination)(query);
        const { isRead } = query;
        const where = {
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
        return (0, pagination_dto_1.buildPaginationResponse)(data, total, page, limit);
    }
    async markRead(id, userId) {
        return this.prisma.notification.update({
            where: { id, userId },
            data: { isRead: true, readAt: new Date() },
        });
    }
    async markAllRead(userId) {
        await this.prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true, readAt: new Date() },
        });
        return { success: true };
    }
    async getUnreadCount(userId) {
        const count = await this.prisma.notification.count({ where: { userId, isRead: false } });
        return { count };
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map