import { PrismaService } from '../prisma/prisma.service';
export declare class DonorsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(query: any): Promise<{
        data: ({
            _count: {
                grants: number;
            };
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            code: string;
            notes: string | null;
            country: string | null;
            donorType: import(".prisma/client").$Enums.DonorType;
            contactName: string | null;
            contactEmail: string | null;
            contactPhone: string | null;
            address: string | null;
            website: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        grants: {
            currency: string;
            id: string;
            name: string;
            code: string;
            status: import(".prisma/client").$Enums.GrantStatus;
            totalBudget: import(".prisma/client/runtime/library").Decimal;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        code: string;
        notes: string | null;
        country: string | null;
        donorType: import(".prisma/client").$Enums.DonorType;
        contactName: string | null;
        contactEmail: string | null;
        contactPhone: string | null;
        address: string | null;
        website: string | null;
    }>;
    create(dto: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        code: string;
        notes: string | null;
        country: string | null;
        donorType: import(".prisma/client").$Enums.DonorType;
        contactName: string | null;
        contactEmail: string | null;
        contactPhone: string | null;
        address: string | null;
        website: string | null;
    }>;
    update(id: string, dto: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        code: string;
        notes: string | null;
        country: string | null;
        donorType: import(".prisma/client").$Enums.DonorType;
        contactName: string | null;
        contactEmail: string | null;
        contactPhone: string | null;
        address: string | null;
        website: string | null;
    }>;
    softDelete(id: string): Promise<void>;
}
