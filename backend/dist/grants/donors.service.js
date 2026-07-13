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
exports.DonorsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_dto_1 = require("../common/dto/pagination.dto");
let DonorsService = class DonorsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { page, limit } = (0, pagination_dto_1.parsePagination)(query);
        const { search } = query;
        const where = {
            deletedAt: null,
            ...(search && {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { code: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };
        const [data, total] = await Promise.all([
            this.prisma.donor.findMany({
                where,
                include: { _count: { select: { grants: true } } },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { name: 'asc' },
            }),
            this.prisma.donor.count({ where }),
        ]);
        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    async findOne(id) {
        const donor = await this.prisma.donor.findUnique({
            where: { id, deletedAt: null },
            include: {
                grants: {
                    where: { deletedAt: null },
                    select: { id: true, code: true, name: true, status: true, totalBudget: true, currency: true },
                },
            },
        });
        if (!donor)
            throw new common_1.NotFoundException(`Donor ${id} not found`);
        return donor;
    }
    async create(dto) {
        return this.prisma.donor.create({ data: dto });
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.donor.update({ where: { id }, data: dto });
    }
    async softDelete(id) {
        const donor = await this.prisma.donor.findUnique({
            where: { id, deletedAt: null },
            include: { _count: { select: { grants: { where: { deletedAt: null } } } } },
        });
        if (!donor)
            throw new common_1.NotFoundException(`Donor ${id} not found`);
        if (donor._count.grants > 0) {
            throw new common_1.BadRequestException('Cannot delete a donor that has associated grants. Remove or reassign grants first.');
        }
        await this.prisma.donor.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
};
exports.DonorsService = DonorsService;
exports.DonorsService = DonorsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DonorsService);
//# sourceMappingURL=donors.service.js.map