import { DonorsService } from './donors.service';
export declare class DonorsController {
    private readonly donorsService;
    constructor(donorsService: DonorsService);
    findAll(query: any): Promise<{
        data: ({
            _count: {
                grants: number;
            };
        } & {
            id: string;
            name: string;
            code: string;
            country: string | null;
            donorType: import(".prisma/client").$Enums.DonorType;
            contactName: string | null;
            contactEmail: string | null;
            contactPhone: string | null;
            address: string | null;
            website: string | null;
            notes: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    create(dto: any): Promise<{
        id: string;
        name: string;
        code: string;
        country: string | null;
        donorType: import(".prisma/client").$Enums.DonorType;
        contactName: string | null;
        contactEmail: string | null;
        contactPhone: string | null;
        address: string | null;
        website: string | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    findOne(id: string): Promise<{
        grants: {
            id: string;
            name: string;
            code: string;
            currency: string;
            totalBudget: import(".prisma/client/runtime/library").Decimal;
            status: import(".prisma/client").$Enums.GrantStatus;
        }[];
    } & {
        id: string;
        name: string;
        code: string;
        country: string | null;
        donorType: import(".prisma/client").$Enums.DonorType;
        contactName: string | null;
        contactEmail: string | null;
        contactPhone: string | null;
        address: string | null;
        website: string | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    update(id: string, dto: any): Promise<{
        id: string;
        name: string;
        code: string;
        country: string | null;
        donorType: import(".prisma/client").$Enums.DonorType;
        contactName: string | null;
        contactEmail: string | null;
        contactPhone: string | null;
        address: string | null;
        website: string | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    remove(id: string): Promise<void>;
}
