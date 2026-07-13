import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WorkflowService } from '../../workflow/workflow.service';
import { SerialService } from '../../serial/serial.service';
import { AuditService } from '../../audit/audit.service';
import { GrantsService } from '../../grants/grants.service';
import { DocumentStatus, Prisma } from '@prisma/client';
import { UserPayload } from '../../common/decorators/current-user.decorator';
import { buildPaginationResponse, parsePagination } from '../../common/dto/pagination.dto';

@Injectable()
export class PurchaseOrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly workflowSvc: WorkflowService,
    private readonly serialSvc: SerialService,
    private readonly auditSvc: AuditService,
    private readonly grantsSvc: GrantsService,
  ) {}

  async findAll(query: any) {
    const { page, limit } = parsePagination(query);
    const { search, status, grantId, vendorId } = query;
    const where: any = {
      deletedAt: null,
      ...(status && { status }),
      ...(grantId && { grantId }),
      ...(vendorId && { vendorId }),
      ...(search && {
        OR: [
          { serialNumber: { contains: search, mode: 'insensitive' } },
          { title: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.purchaseOrder.findMany({
        where,
        include: {
          vendor: { select: { id: true, name: true } },
          grant: { select: { id: true, code: true, name: true } },
          _count: { select: { items: true, goodsReceipts: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.purchaseOrder.count({ where }),
    ]);

    return buildPaginationResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    const po = await this.prisma.purchaseOrder.findUnique({
      where: { id, deletedAt: null },
      include: {
        vendor: true,
        grant: true,
        pr: { select: { id: true, serialNumber: true, title: true } },
        items: true,
        workflow: {
          include: {
            steps: { orderBy: { stepNumber: 'asc' } },
            actions: { include: { actor: { select: { firstName: true, lastName: true } } }, orderBy: { actionAt: 'asc' } },
          },
        },
        goodsReceipts: {
          select: { id: true, serialNumber: true, status: true, receiptDate: true },
        },
        invoices: {
          select: { id: true, serialNumber: true, status: true, totalAmount: true, currency: true },
        },
      },
    });
    if (!po) throw new NotFoundException(`Purchase Order ${id} not found`);
    return po;
  }

  async create(dto: any, user: UserPayload) {
    const grant = await this.prisma.grant.findUnique({ where: { id: dto.grantId } });
    if (!grant) throw new NotFoundException('Grant not found');

    const serialNumber = await this.serialSvc.next(grant.code, 'PO');

    const po = await this.prisma.purchaseOrder.create({
      data: {
        serialNumber,
        prId: dto.prId,
        rfqId: dto.rfqId,
        pafId: dto.pafId,
        vendorId: dto.vendorId,
        grantId: dto.grantId,
        budgetLineId: dto.budgetLineId,
        contractId: dto.contractId,
        title: dto.title,
        deliveryAddress: dto.deliveryAddress,
        deliveryDate: dto.deliveryDate ? new Date(dto.deliveryDate) : null,
        currency: dto.currency || 'USD',
        subtotal: new Prisma.Decimal(dto.subtotal),
        taxAmount: new Prisma.Decimal(dto.taxAmount || '0'),
        totalAmount: new Prisma.Decimal(dto.totalAmount),
        terms: dto.terms,
        notes: dto.notes,
        status: DocumentStatus.DRAFT,
        createdById: user.id,
        items: dto.items ? {
          create: dto.items.map((item: any) => ({
            description: item.description,
            specification: item.specification,
            unit: item.unit,
            orderedQuantity: new Prisma.Decimal(item.orderedQuantity),
            unitPrice: new Prisma.Decimal(item.unitPrice),
            totalPrice: new Prisma.Decimal(Number(item.orderedQuantity) * Number(item.unitPrice)),
            budgetLineId: item.budgetLineId,
          })),
        } : undefined,
      },
      include: { items: true, vendor: true, grant: true },
    });

    await this.auditSvc.log({
      userId: user.id,
      action: 'CREATE',
      module: 'PURCHASE_ORDERS',
      resource: 'PurchaseOrder',
      resourceId: po.id,
      newValues: { serialNumber, vendorId: po.vendorId, totalAmount: po.totalAmount },
    });

    return po;
  }

  async submit(id: string, user: UserPayload) {
    const po = await this.findOne(id);
    if (po.status !== DocumentStatus.DRAFT && po.status !== DocumentStatus.RETURNED) {
      throw new BadRequestException('Only DRAFT or RETURNED POs can be submitted');
    }

    const workflowInstance = await this.workflowSvc.startWorkflow('PURCHASE_ORDER', id, user.id);

    return this.prisma.purchaseOrder.update({
      where: { id },
      data: { status: DocumentStatus.SUBMITTED, workflowInstanceId: workflowInstance?.id },
    });
  }

  async approve(id: string, comment: string | undefined, user: UserPayload) {
    const po = await this.findOne(id);
    if (!po.workflowInstanceId) throw new BadRequestException('No active workflow');

    const instance = await this.workflowSvc.processAction(po.workflowInstanceId, 'APPROVE' as any, user.id, comment);

    let newStatus = po.status;
    if (instance.status === 'APPROVED') {
      newStatus = DocumentStatus.APPROVED;
    }

    return this.prisma.purchaseOrder.update({ where: { id }, data: { status: newStatus } });
  }

  async issue(id: string, user: UserPayload) {
    const po = await this.findOne(id);
    if (po.status !== DocumentStatus.APPROVED) {
      throw new BadRequestException('Only APPROVED POs can be issued');
    }
    return this.prisma.purchaseOrder.update({
      where: { id },
      data: { status: 'ISSUED' as any, issuedById: user.id, issuedAt: new Date() },
    });
  }

  async getPaymentStatus(id: string) {
    const po = await this.findOne(id);
    return {
      totalAmount: Number(po.totalAmount),
      paidAmount: Number(po.paidAmount),
      remainingAmount: Number(po.totalAmount) - Number(po.paidAmount),
      paymentPercent: Number(po.totalAmount) > 0
        ? (Number(po.paidAmount) / Number(po.totalAmount)) * 100
        : 0,
    };
  }

  async softDelete(id: string, user: UserPayload) {
    const po = await this.findOne(id);
    if (po.status === DocumentStatus.APPROVED || po.status === 'ISSUED' as any) {
      throw new BadRequestException('Cannot delete an approved or issued PO');
    }
    await this.prisma.purchaseOrder.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
