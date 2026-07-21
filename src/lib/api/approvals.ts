import * as procurementApi from './procurement';
import * as financeApi from './finance';

export type ApprovalAction = 'APPROVE' | 'REJECT' | 'RETURN';

export interface ProcessDocumentApprovalInput {
  documentType: string;
  documentId: string;
  action: ApprovalAction;
  comment?: string;
}

export async function processDocumentApproval({
  documentType,
  documentId,
  action,
  comment,
}: ProcessDocumentApprovalInput) {
  switch (documentType) {
    case 'PURCHASE_REQUISITION':
      if (action === 'APPROVE') return procurementApi.approvePurchaseRequisition(documentId, comment);
      if (action === 'REJECT') return procurementApi.rejectPurchaseRequisition(documentId, comment ?? '');
      return procurementApi.returnPurchaseRequisition(documentId, comment ?? '');
    case 'PURCHASE_ORDER':
      if (action !== 'APPROVE') {
        throw new Error('Purchase orders only support approval at this time');
      }
      return procurementApi.approvePurchaseOrder(documentId, comment);
    case 'GOODS_RECEIPT':
      if (action === 'APPROVE') {
        return procurementApi.approveGoodsReceipt(documentId, comment);
      }
      if (action === 'REJECT') {
        return procurementApi.rejectGoodsReceipt(documentId, comment ?? '');
      }
      if (action === 'RETURN') {
        return procurementApi.returnGoodsReceipt(documentId, comment ?? '');
      }
      throw new Error(`Unsupported goods receipt action: ${action}`);
    case 'PAYMENT_VOUCHER':
      if (action !== 'APPROVE') {
        throw new Error('Payment vouchers only support approval at this time');
      }
      return financeApi.approvePaymentVoucher(documentId, comment);
    default:
      throw new Error(`Unsupported document type: ${documentType}`);
  }
}
