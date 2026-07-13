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
var SerialService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerialService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SerialService = SerialService_1 = class SerialService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(SerialService_1.name);
    }
    async next(grantCode, docType, padding = 4) {
        const lockKey = this.computeLockKey(grantCode, docType);
        return this.prisma.withAdvisoryLock(lockKey, async () => {
            const sequence = await this.prisma.serialSequence.upsert({
                where: {
                    grantCode_docType: {
                        grantCode,
                        docType: docType,
                    },
                },
                update: { lastNumber: { increment: 1 } },
                create: {
                    grantCode,
                    docType: docType,
                    lastNumber: 1,
                },
            });
            const paddedNumber = sequence.lastNumber.toString().padStart(padding, '0');
            return `${grantCode}-${docType}-${paddedNumber}`;
        });
    }
    async preview(grantCode, docType, padding = 4) {
        const sequence = await this.prisma.serialSequence.findUnique({
            where: {
                grantCode_docType: {
                    grantCode,
                    docType: docType,
                },
            },
        });
        const nextNumber = (sequence?.lastNumber ?? 0) + 1;
        const paddedNumber = nextNumber.toString().padStart(padding, '0');
        return `${grantCode}-${docType}-${paddedNumber}`;
    }
    async getGrantSequences(grantCode) {
        return this.prisma.serialSequence.findMany({
            where: { grantCode },
            orderBy: { docType: 'asc' },
        });
    }
    async getAllSequences() {
        return this.prisma.serialSequence.findMany({
            orderBy: [{ grantCode: 'asc' }, { docType: 'asc' }],
        });
    }
    async resetSequence(grantCode, docType) {
        this.logger.warn(`Resetting serial sequence: ${grantCode}-${docType}`);
        await this.prisma.serialSequence.updateMany({
            where: { grantCode, docType: docType },
            data: { lastNumber: 0 },
        });
    }
    computeLockKey(grantCode, docType) {
        const str = `${grantCode}:${docType}`;
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash;
        }
        return Math.abs(hash) % 2147483647;
    }
};
exports.SerialService = SerialService;
exports.SerialService = SerialService = SerialService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SerialService);
//# sourceMappingURL=serial.service.js.map