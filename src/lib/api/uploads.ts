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
  uploadedBy?: { id: string; firstName: string; lastName: string };
  createdAt: string;
  deletedAt: string | null;
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
