import { SearchService } from './search.service';
export declare class SearchController {
    private readonly svc;
    constructor(svc: SearchService);
    search(query: string, limit?: string): Promise<{
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
