import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InvoiceStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { WorkflowService } from '../../workflow/workflow.service';
import { SerialService } from '../../serial/serial.service';
import { AuditService } from '../../audit/audit.service';
import { UserPayload } from '../../common/decorators/current-user.decorator';
import { buildPaginationResponse, parsePagination } from '../../common/dto/pagination.dto';

const INVOICE_PO_STATUSES = new Set(['APPROVED', 'ISSUED']);

@Injectable()
export class VendorInvoicesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly workflowSvc: WorkflowService,
    private readonly serialSvc: SerialService,
    private readonly auditSvc: AuditService,
  ) {}

  async findAll(query: any) {
    const { page, limit } = parsePagination(query);
    const { search, status, poId } = query;
    const where: Prisma.VendorInvoiceWhereInput = {
      deletedAt: null,
      ...(status && { status: status as InvoiceStatus }),
      ...(poId && { poId }),
      ...(search && {
        OR: [
          { serialNumber: { contains: search, mode: 'insensitive' } },
          { invoiceNumber: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.vendorInvoice.findMany({
        where,
        include: {
          po: { select: { id: true, serialNumber: true, title: true, status: true } },
          grn: { select: { id: true, serialNumber: true, status: true } },
          vendor: { select: { id: true, name: true } },
          grant: { select: { id: true, code: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.vendorInvoice.count({ where }),
    ]);

    return buildPaginationResponse(data, total, page, limit);
  }

  async findOne(id: string, user?: UserPayload) {
    const invoice = await this.prisma.vendorInvoice.findFirst({
      where: { id, deletedAt: null },
      include: {
        po: {
          include: {
            items: true,
            goodsReceipts: {
              where: { deletedAt: null },
              select: { id: true, serialNumber: true, status: true, receiptDate: true },
            },
          },
        },
        grn: {
          select: {
            id: true,
            serialNumber: true,
            status: true,
            receiptDate: true,
          },
        },
        vendor: {
          include: {
            bankAccounts: { orderBy: [{ isPrimary: 'desc' }, { createdAt: 'asc' }] },
          },
        },
        grant: { select: { id: true, code: true, name: true } },
        workflow: {
          include: {
            steps: { orderBy: { stepNumber: 'asc' } },
            actions: {
              include: {
                actor: { select: { id: true, firstName: true, lastName: true } },
              },
              orderBy: { actionAt: 'asc' },
            },
          },
        },
      },
    });
    if (!invoice) throw new NotFoundException(`Vendor invoice ${id} not found`);

    const approvalContext = user
      ? await this.workflowSvc.buildApprovalContext(
          invoice.workflow,
          user.id,
          user.roles,
        )
      : await this.workflowSvc.buildApprovalContext(invoice.workflow);

    return { ...invoice, approvalContext };
  }

  async create(dto: any, user: UserPayload) {
    let poId = dto.poId as string | undefined;
    let grnId = (dto.grnId as string | undefined) || undefined;
    let computedSubtotal: Prisma.Decimal | null = null;

    if (grnId) {
      const grn = await this.prisma.goodsReceipt.findFirst({
        where: { id: grnId, deletedAt: null },
        include: {
          items: { include: { poItem: true } },
          po: { include: { grant: true, vendor: true } },
        },
      });
      if (!grn) throw new NotFoundException('Goods Receipt not found');
      if (grn.status !== 'APPROVED') {
        throw new BadRequestException(
          'Only APPROVED goods receipts can be used to create a vendor invoice',
        );
      }

      const existingForGrn = await this.prisma.vendorInvoice.findFirst({
        where: { grnId, deletedAt: null },
        select: { id: true, serialNumber: true },
      });
      if (existingForGrn) {
        throw new BadRequestException(
          `A vendor invoice already exists for this GRN (${existingForGrn.serialNumber})`,
        );
      }

      poId = grn.poId;
      let subtotalNum = 0;
      for (const item of grn.items) {
        const accepted = Number(item.acceptedQuantity) || 0;
        const unitPrice = Number(item.poItem?.unitPrice) || 0;
        subtotalNum += accepted * unitPrice;
      }
      computedSubtotal = new Prisma.Decimal(subtotalNum);
    }

    if (!poId) throw new BadRequestException('PO or GRN is required');

    const po = await this.prisma.purchaseOrder.findFirst({
      where: { id: poId, deletedAt: null },
      include: { grant: true, vendor: true },
    });
    if (!po) throw new NotFoundException('Purchase Order not found');
    if (!INVOICE_PO_STATUSES.has(po.status)) {
      throw new BadRequestException(
        'PO must be APPROVED or ISSUED to create a vendor invoice',
      );
    }

    const subtotal = new Prisma.Decimal(
      dto.subtotal ?? computedSubtotal ?? dto.totalAmount ?? 0,
    );
    const taxAmount = new Prisma.Decimal(dto.taxAmount ?? 0);
    const totalAmount = new Prisma.Decimal(dto.totalAmount ?? subtotal.add(taxAmount));
    const serialNumber = await this.serialSvc.next(po.grant.code, 'INV');

    const invoice = await this.prisma.vendorInvoice.create({
      data: {
        serialNumber,
        poId: po.id,
        grnId: grnId || null,
        vendorId: dto.vendorId || po.vendorId,
        grantId: po.grantId,
        invoiceNumber: dto.invoiceNumber,
        invoiceDate: new Date(dto.invoiceDate || Date.now()),
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        currency: dto.currency || po.currency,
        subtotal,
        taxAmount,
        totalAmount,
        status: InvoiceStatus.RECEIVED,
        notes: dto.notes,
        fileUrl: dto.fileUrl,
        createdById: user.id,
      },
      include: {
        po: { select: { id: true, serialNumber: true } },
        grn: { select: { id: true, serialNumber: true } },
        vendor: { select: { id: true, name: true } },
      },
    });

    await this.auditSvc.log({
      userId: user.id,
      action: 'CREATE',
      module: 'INVOICES',
      resource: 'VendorInvoice',
      resourceId: invoice.id,
      newValues: {
        serialNumber,
        poId: po.id,
        grnId: grnId || null,
        invoiceNumber: invoice.invoiceNumber,
      },
    });

    return invoice;
  }

  async submit(id: string, user: UserPayload) {
    const invoice = await this.findOne(id);
    if (invoice.status !== InvoiceStatus.RECEIVED) {
      throw new BadRequestException('Only RECEIVED invoices can be submitted for matching');
    }

    const workflowInstance = await this.workflowSvc.startWorkflow(
      'VENDOR_INVOICE',
      id,
      user.id,
    );

    return this.prisma.vendorInvoice.update({
      where: { id },
      data: {
        status: InvoiceStatus.MATCHED,
        isThreeWayMatched: false,
        workflowInstanceId: workflowInstance?.id,
      },
    });
  }

  async approve(id: string, comment: string | undefined, user: UserPayload) {
    const invoice = await this.findOne(id);
    if (!invoice.workflowInstanceId) {
      throw new BadRequestException('No active workflow');
    }

    const instance = await this.workflowSvc.processAction(
      invoice.workflowInstanceId,
      'APPROVE' as any,
      user.id,
      comment,
      { ipAddress: user.ipAddress, userAgent: user.userAgent },
    );

    if (instance.status === 'APPROVED') {
      await this.prisma.vendorInvoice.update({
        where: { id },
        data: {
          status: InvoiceStatus.APPROVED,
          isThreeWayMatched: true,
          matchedAt: new Date(),
          matchedById: user.id,
        },
      });
    }

    return instance;
  }

  async softDelete(id: string, user: UserPayload) {
    const invoice = await this.findOne(id);
    if (invoice.status === InvoiceStatus.APPROVED || invoice.status === InvoiceStatus.PAID) {
      throw new BadRequestException('Cannot delete an approved or paid invoice');
    }
    await this.prisma.vendorInvoice.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    await this.auditSvc.log({
      userId: user.id,
      action: 'DELETE',
      module: 'INVOICES',
      resource: 'VendorInvoice',
      resourceId: id,
    });
  }
}
