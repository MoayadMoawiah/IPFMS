import { apiClient } from './client';

export interface DocumentAttachment {
  id: string;
  documentType: string;
  documentId: string;
  fileName: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  fileUrl: string;
  storageKey: string;
  uploadedById: string;
  uploadedBy?: { id: string; firstName: string; lastName: string } | null;
  createdAt: string;
  deletedAt: string | null;
}

export type SupportingDocumentSource =
  | 'pr'
  | 'po'
  | 'grn'
  | 'invoice'
  | 'payment_request'
  | 'payment_voucher';

export interface SupportingDocument extends DocumentAttachment {
  source: SupportingDocumentSource;
}

export async function uploadGrantDocument(
  grantId: string,
  file: File,
  label: string,
): Promise<DocumentAttachment> {
  const form = new FormData();
  form.append('files', file);
  form.append('labels', JSON.stringify([label]));

  const { data } = await apiClient.post<{ data: DocumentAttachment[] }>(
    `/grants/${grantId}/documents`,
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data.data[0];
}

export async function uploadGrantDocuments(
  grantId: string,
  files: File[],
  labels: string[],
): Promise<DocumentAttachment[]> {
  const form = new FormData();
  files.forEach((f) => form.append('files', f));
  form.append('labels', JSON.stringify(labels));

  const { data } = await apiClient.post<{ data: DocumentAttachment[] }>(
    `/grants/${grantId}/documents`,
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data.data;
}

export async function getGrantDocuments(grantId: string): Promise<DocumentAttachment[]> {
  const { data } = await apiClient.get<{ data: DocumentAttachment[] }>(
    `/grants/${grantId}/documents`,
  );
  return data.data;
}

export async function deleteGrantDocument(
  grantId: string,
  attachmentId: string,
): Promise<void> {
  await apiClient.delete(`/grants/${grantId}/documents/${attachmentId}`);
}

export async function uploadActivityDocuments(
  activityId: string,
  files: File[],
  labels: string[],
): Promise<DocumentAttachment[]> {
  const form = new FormData();
  files.forEach((f) => form.append('files', f));
  form.append('labels', JSON.stringify(labels));

  const { data } = await apiClient.post<{ data: DocumentAttachment[] }>(
    `/projects/activities/${activityId}/documents`,
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data.data;
}

export async function getActivityDocuments(activityId: string): Promise<DocumentAttachment[]> {
  const { data } = await apiClient.get<{ data: DocumentAttachment[] }>(
    `/projects/activities/${activityId}/documents`,
  );
  return data.data;
}

export async function deleteActivityDocument(
  activityId: string,
  attachmentId: string,
): Promise<void> {
  await apiClient.delete(`/projects/activities/${activityId}/documents/${attachmentId}`);
}

export async function uploadRequisitionDocuments(
  requisitionId: string,
  files: File[],
  labels: string[],
): Promise<DocumentAttachment[]> {
  const form = new FormData();
  files.forEach((f) => form.append('files', f));
  form.append('labels', JSON.stringify(labels));

  const { data } = await apiClient.post<{ data: DocumentAttachment[] }>(
    `/procurement/requisitions/${requisitionId}/documents`,
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data.data;
}

export async function getRequisitionDocuments(
  requisitionId: string,
): Promise<DocumentAttachment[]> {
  const { data } = await apiClient.get<{ data: DocumentAttachment[] }>(
    `/procurement/requisitions/${requisitionId}/documents`,
  );
  return data.data;
}

export async function deleteRequisitionDocument(
  requisitionId: string,
  attachmentId: string,
): Promise<void> {
  await apiClient.delete(
    `/procurement/requisitions/${requisitionId}/documents/${attachmentId}`,
  );
}

export async function uploadPurchaseOrderDocuments(
  purchaseOrderId: string,
  files: File[],
  labels: string[],
): Promise<DocumentAttachment[]> {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  form.append("labels", JSON.stringify(labels));

  const { data } = await apiClient.post<{ data: DocumentAttachment[] }>(
    `/procurement/purchase-orders/${purchaseOrderId}/documents`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data.data;
}

export async function getPurchaseOrderDocuments(
  purchaseOrderId: string,
): Promise<DocumentAttachment[]> {
  const { data } = await apiClient.get<{ data: DocumentAttachment[] }>(
    `/procurement/purchase-orders/${purchaseOrderId}/documents`,
  );
  return data.data;
}

export async function deletePurchaseOrderDocument(
  purchaseOrderId: string,
  attachmentId: string,
): Promise<void> {
  await apiClient.delete(
    `/procurement/purchase-orders/${purchaseOrderId}/documents/${attachmentId}`,
  );
}

export async function uploadGoodsReceiptDocuments(
  goodsReceiptId: string,
  files: File[],
  labels: string[],
): Promise<DocumentAttachment[]> {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  form.append("labels", JSON.stringify(labels));

  const { data } = await apiClient.post<{ data: DocumentAttachment[] }>(
    `/procurement/goods-receipts/${goodsReceiptId}/documents`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data.data;
}

export async function getGoodsReceiptDocuments(
  goodsReceiptId: string,
): Promise<DocumentAttachment[]> {
  const { data } = await apiClient.get<{ data: DocumentAttachment[] }>(
    `/procurement/goods-receipts/${goodsReceiptId}/documents`,
  );
  return data.data;
}

export async function deleteGoodsReceiptDocument(
  goodsReceiptId: string,
  attachmentId: string,
): Promise<void> {
  await apiClient.delete(
    `/procurement/goods-receipts/${goodsReceiptId}/documents/${attachmentId}`,
  );
}

export async function uploadPaymentRequestDocuments(
  paymentRequestId: string,
  files: File[],
  labels: string[],
): Promise<DocumentAttachment[]> {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  form.append("labels", JSON.stringify(labels));

  const { data } = await apiClient.post<{ data: DocumentAttachment[] }>(
    `/finance/payment-requests/${paymentRequestId}/documents`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data.data;
}

export async function getPaymentRequestDocuments(
  paymentRequestId: string,
): Promise<DocumentAttachment[]> {
  const { data } = await apiClient.get<{ data: DocumentAttachment[] }>(
    `/finance/payment-requests/${paymentRequestId}/documents`,
  );
  return data.data;
}

export async function deletePaymentRequestDocument(
  paymentRequestId: string,
  attachmentId: string,
): Promise<void> {
  await apiClient.delete(
    `/finance/payment-requests/${paymentRequestId}/documents/${attachmentId}`,
  );
}

export async function getPaymentRequestSupportingDocuments(
  paymentRequestId: string,
): Promise<SupportingDocument[]> {
  const { data } = await apiClient.get<{ data: SupportingDocument[] }>(
    `/finance/payment-requests/${paymentRequestId}/supporting-documents`,
  );
  return data.data;
}

export async function getPaymentVoucherSupportingDocuments(
  paymentVoucherId: string,
): Promise<SupportingDocument[]> {
  const { data } = await apiClient.get<{ data: SupportingDocument[] }>(
    `/finance/payment-vouchers/${paymentVoucherId}/supporting-documents`,
  );
  return data.data;
}

export async function uploadPaymentVoucherDocuments(
  paymentVoucherId: string,
  files: File[],
  labels: string[],
): Promise<DocumentAttachment[]> {
  const form = new FormData();
  files.forEach((f) => form.append('files', f));
  form.append('labels', JSON.stringify(labels));

  const { data } = await apiClient.post<{ data: DocumentAttachment[] }>(
    `/finance/payment-vouchers/${paymentVoucherId}/documents`,
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data.data;
}

export async function deletePaymentVoucherDocument(
  paymentVoucherId: string,
  attachmentId: string,
): Promise<void> {
  await apiClient.delete(
    `/finance/payment-vouchers/${paymentVoucherId}/documents/${attachmentId}`,
  );
}
