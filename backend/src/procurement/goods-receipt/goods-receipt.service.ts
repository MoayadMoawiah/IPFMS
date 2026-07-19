import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WorkflowService } from '../../workflow/workflow.service';
import { SerialService } from '../../serial/serial.service';
import { AuditService } from '../../audit/audit.service';
import { DocumentStatus, Prisma } from '@prisma/client';
import { UserPayload } from '../../common/decorators/current-user.decorator';
import { buildPaginationResponse, parsePagination } from '../../common/dto/pagination.dto';

@Injectable()
export class GoodsReceiptService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly workflowSvc: WorkflowService,
    private readonly serialSvc: SerialService,
    private readonly auditSvc: AuditService,
  ) {}

  async findAll(query: any) {
    const { page, limit } = parsePagination(query);
    const { search, status } = query;
    const where: any = {
      deletedAt: null,
      ...(status && { status }),
      ...(search && {
        OR: [
          { serialNumber: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.goodsReceipt.findMany({
        where,
        include: {
          po: { select: { id: true, serialNumber: true, title: true } },
          grant: { select: { id: true, code: true } },
          receivedBy: { select: { id: true, firstName: true, lastName: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.goodsReceipt.count({ where }),
    ]);

    return buildPaginationResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    const userWithRoles = {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        roles: { include: { role: { select: { id: true, name: true } } } },
      },
    };

    const grn = await this.prisma.goodsReceipt.findUnique({
      where: { id, deletedAt: null },
      include: {
        po: { include: { items: true, vendor: { select: { id: true, name: true } } } },
        grant: true,
        warehouse: true,
        receivedBy: userWithRoles,
        items: { include: { poItem: true } },
        workflow: {
          include: {
            steps: {
              orderBy: { stepNumber: 'asc' },
              include: {
                digitalSignature: { include: { user: userWithRoles } },
              },
            },
            actions: {
              include: { actor: userWithRoles },
              orderBy: { actionAt: 'asc' },
            },
          },
        },
      },
    });
    if (!grn) throw new NotFoundException(`GRN ${id} not found`);
    return grn;
  }

  async create(dto: any, user: UserPayload) {
    const po = await this.prisma.purchaseOrder.findUnique({
      where: { id: dto.poId },
      include: { grant: true },
    });
    if (!po) throw new NotFoundException('Purchase Order not found');
    if (po.status !== 'APPROVED' && po.status !== 'SUBMITTED') {
      throw new BadRequestException('PO must be APPROVED or SUBMITTED to create GRN');
    }

    const serialNumber = await this.serialSvc.next(po.grant.code, 'GRN');

    const grn = await this.prisma.goodsReceipt.create({
      data: {
        serialNumber,
        poId: dto.poId,
        grantId: po.grantId,
        warehouseId: dto.warehouseId,
        receiptDate: new Date(dto.receiptDate || Date.now()),
        deliveryNote: dto.deliveryNote,
        notes: dto.notes,
        status: DocumentStatus.DRAFT,
        receivedById: user.id,
        items: dto.items ? {
          create: dto.items.map((item: any) => ({
            poItemId: item.poItemId,
            description: item.description,
            orderedQuantity: new Prisma.Decimal(item.orderedQuantity),
            deliveredQuantity: new Prisma.Decimal(item.deliveredQuantity),
            acceptedQuantity: new Prisma.Decimal(item.acceptedQuantity),
            rejectedQuantity: new Prisma.Decimal(item.rejectedQuantity || '0'),
            damagedQuantity: new Prisma.Decimal(item.damagedQuantity || '0'),
            notes: item.notes,
          })),
        } : undefined,
      },
      include: { items: true },
    });

    await this.auditSvc.log({
      userId: user.id,
      action: 'CREATE',
      module: 'GOODS_RECEIPTS',
      resource: 'GoodsReceipt',
      resourceId: grn.id,
      newValues: { serialNumber, poId: grn.poId },
    });

    return grn;
  }

  async submit(id: string, user: UserPayload) {
    const grn = await this.findOne(id);
    if (grn.status !== DocumentStatus.DRAFT) throw new BadRequestException('Only DRAFT GRNs can be submitted');

    const workflowInstance = await this.workflowSvc.startWorkflow('GOODS_RECEIPT', id, user.id);

    return this.prisma.goodsReceipt.update({
      where: { id },
      data: { status: DocumentStatus.SUBMITTED, workflowInstanceId: workflowInstance?.id },
    });
  }

  async approve(id: string, comment: string | undefined, user: UserPayload) {
    const grn = await this.findOne(id);
    if (!grn.workflowInstanceId) throw new BadRequestException('No active workflow');

    const instance = await this.workflowSvc.processAction(
      grn.workflowInstanceId,
      'APPROVE' as any,
      user.id,
      comment,
      { ipAddress: user.ipAddress, userAgent: user.userAgent },
    );

    if (instance.status === 'APPROVED') {
      // Update PO received quantities and status
      for (const item of grn.items) {
        await this.prisma.poItem.update({
          where: { id: item.poItemId },
          data: { receivedQuantity: { increment: new Prisma.Decimal(Number(item.acceptedQuantity)) } },
        });
      }

      // Update inventory stock
      for (const item of grn.items) {
        if (item.acceptedQuantity && Number(item.acceptedQuantity) > 0) {
          // Stock movement would be added here linked to warehouse
        }
      }

      await this.prisma.goodsReceipt.update({
        where: { id },
        data: { status: DocumentStatus.APPROVED },
      });
    }

    return instance;
  }

  async softDelete(id: string, user: UserPayload) {
    await this.findOne(id);
    await this.prisma.goodsReceipt.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
