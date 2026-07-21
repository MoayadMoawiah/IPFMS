import { apiClient } from './client';

export type WorkflowBoardDocumentType =
  | 'PURCHASE_REQUISITION'
  | 'PURCHASE_ORDER'
  | 'GOODS_RECEIPT'
  | 'VENDOR_INVOICE'
  | 'PAYMENT_REQUEST'
  | 'PAYMENT_VOUCHER';

export interface WorkflowBoardColumn {
  key: string;
  type: 'step' | 'terminal';
  stepNumber: number | null;
  name: string;
}

export interface WorkflowBoardCard {
  instanceId: string;
  documentType: string;
  documentId: string;
  workflowStatus: string;
  currentStepNumber: number;
  currentStepName: string | null;
  waitingForRoleName: string | null;
  columnKey: string;
  canMoveForward: boolean;
  canMoveBack: boolean;
  canReturnToRequester: boolean;
  canReopen: boolean;
  document: {
    id: string;
    serialNumber?: string;
    title?: string;
    status?: string;
    label?: string;
    href?: string;
  } | null;
  steps: Array<{ stepNumber: number; stepName: string; status: string }>;
}

export interface WorkflowBoardResponse {
  documentType: string;
  template: {
    id: string;
    name: string;
    steps: Array<{ stepNumber: number; name: string; approverRoleId: string | null }>;
  };
  columns: WorkflowBoardColumn[];
  cards: WorkflowBoardCard[];
  documentTypes: string[];
}

export async function getWorkflowAdminBoard(documentType: string) {
  const { data } = await apiClient.get('/workflow/admin/board', {
    params: { documentType },
  });
  return data.data as WorkflowBoardResponse;
}

export async function adminMoveWorkflow(
  instanceId: string,
  direction: 'FORWARD' | 'BACK',
  comment: string,
) {
  const { data } = await apiClient.post(`/workflow/admin/instances/${instanceId}/move`, {
    direction,
    comment,
  });
  return data.data;
}

export async function adminSetWorkflowStep(
  instanceId: string,
  stepNumber: number,
  comment: string,
) {
  const { data } = await apiClient.post(
    `/workflow/admin/instances/${instanceId}/set-step`,
    { stepNumber, comment },
  );
  return data.data;
}

export async function adminReturnWorkflowToRequester(
  instanceId: string,
  comment: string,
) {
  const { data } = await apiClient.post(
    `/workflow/admin/instances/${instanceId}/return-to-requester`,
    { comment },
  );
  return data.data;
}

export async function adminReopenWorkflow(dto: {
  documentType: string;
  documentId: string;
  stepNumber?: number;
  comment: string;
}) {
  const { data } = await apiClient.post('/workflow/admin/reopen', dto);
  return data.data;
}
