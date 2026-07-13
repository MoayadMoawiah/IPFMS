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
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_dto_1 = require("../common/dto/pagination.dto");
let AuditService = class AuditService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async log(dto) {
        try {
            await this.prisma.auditLog.create({
                data: {
                    userId: dto.userId,
                    userEmail: dto.userEmail,
                    action: dto.action,
                    module: dto.module,
                    resource: dto.resource,
                    resourceId: dto.resourceId,
                    oldValues: dto.oldValues ? JSON.parse(JSON.stringify(dto.oldValues)) : undefined,
                    newValues: dto.newValues ? JSON.parse(JSON.stringify(dto.newValues)) : undefined,
                    ipAddress: dto.ipAddress,
                    userAgent: dto.userAgent,
                    sessionId: dto.sessionId,
                    requestId: dto.requestId,
                    duration: dto.duration,
                },
            });
        }
        catch {
        }
    }
    async findAll(filters) {
        const { page, limit } = (0, pagination_dto_1.parsePagination)({ limit: filters.limit ?? 50, page: filters.page ?? 1 });
        const where = {};
        if (filters.userId)
            where.userId = filters.userId;
        if (filters.module)
            where.module = filters.module;
        if (filters.resource)
            where.resource = filters.resource;
        if (filters.resourceId)
            where.resourceId = filters.resourceId;
        if (filters.action)
            where.action = filters.action;
        if (filters.startDate || filters.endDate) {
            where.createdAt = {};
            if (filters.startDate)
                where.createdAt.gte = filters.startDate;
            if (filters.endDate)
                where.createdAt.lte = filters.endDate;
        }
        const [data, total] = await Promise.all([
            this.prisma.auditLog.findMany({
                where,
                include: { user: { select: { firstName: true, lastName: true, email: true } } },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.auditLog.count({ where }),
        ]);
        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    async findByDocument(documentType, documentId) {
        return this.prisma.auditLog.findMany({
            where: { resource: documentType, resourceId: documentId },
            include: { user: { select: { firstName: true, lastName: true, email: true } } },
            orderBy: { createdAt: 'asc' },
        });
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditService);
//# sourceMappingURL=audit.service.js.map