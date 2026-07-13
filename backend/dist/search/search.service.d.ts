import { PrismaService } from '../prisma/prisma.service';
export declare class SearchService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    globalSearch(query: string, limit?: number): Promise<{
        results: {
            id: string;
            type: string;
            title: string;
            subtitle: string;
            status: string;
            href: string;
        }[];
        total: number;
        query: string;
    }>;
}
