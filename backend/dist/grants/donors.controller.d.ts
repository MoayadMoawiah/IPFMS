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
    remove(id: string): Promise<void>;
}
