export declare enum SortOrder {
    ASC = "asc",
    DESC = "desc"
}
export declare class PaginationDto {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: SortOrder;
}
export declare function parsePagination(query: any): {
    page: number;
    limit: number;
};
export declare function buildPaginationResponse<T>(data: T[], total: number, page: number, limit: number): {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
};
