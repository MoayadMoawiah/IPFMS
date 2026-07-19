export interface PrApprovalResult {
  status?: string;
  procurementRoute?: 'RFQ' | 'DIRECT_PO';
  nextStep?: {
    type: 'RFQ' | 'PO';
    rfqId?: string;
    redirectUrl: string;
  };
}

export function getPostApprovalRedirect(result: PrApprovalResult | null | undefined): string | null {
  if (result?.status === 'APPROVED' && result.nextStep?.redirectUrl) {
    return result.nextStep.redirectUrl;
  }
  return null;
}
