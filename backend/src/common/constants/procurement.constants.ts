export const RFQ_MIN_AMOUNT_USD = 1001;

export type ProcurementRoute = 'RFQ' | 'DIRECT_PO';

export function resolveProcurementRoute(totalEstimatedAmount: number): ProcurementRoute {
  return totalEstimatedAmount > RFQ_MIN_AMOUNT_USD ? 'RFQ' : 'DIRECT_PO';
}
