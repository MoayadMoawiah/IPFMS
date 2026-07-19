export declare const RFQ_MIN_AMOUNT_USD = 1001;
export type ProcurementRoute = 'RFQ' | 'DIRECT_PO';
export declare function resolveProcurementRoute(totalEstimatedAmount: number): ProcurementRoute;
