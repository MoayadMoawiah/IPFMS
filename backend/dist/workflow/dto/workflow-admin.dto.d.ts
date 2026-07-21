export declare class AdminMoveDto {
    direction: 'FORWARD' | 'BACK';
    comment: string;
}
export declare class AdminSetStepDto {
    stepNumber: number;
    comment: string;
}
export declare class AdminCommentDto {
    comment: string;
}
export declare class AdminReopenDto {
    documentType: string;
    documentId: string;
    stepNumber?: number;
    comment: string;
}
