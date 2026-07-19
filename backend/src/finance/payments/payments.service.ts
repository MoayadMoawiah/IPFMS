import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WorkflowService } from '../../workflow/workflow.service';
import { SerialService } from '../../serial/serial.service';
import { AuditService } from '../../audit/audit.service';
import { DocumentStatus, Prisma } from '@prisma/client';
import { UserPayload } from '../../common/decorators/current-user.decorator';
import { buildPaginationResponse, parsePagination } from '../../common/dto/pagination.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly workflowSvc: WorkflowService,
    private readonly serialSvc: SerialService,
    private readonly auditSvc: AuditService,
  ) {}

  // PAYMENT VOUCHERS
  async findAllVouchers(query: any) {
    const { page, limit } = parsePagination(query);
    const { search, status, grantId } = query;
    const where: any = {
      deletedAt: null,
      ...(status && { status }),
      ...(grantId && { grantId }),
      ...(search && {
        OR: [
          { serialNumber: { contains: search, mode: 'insensitive' } },
          { payeeName: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.paymentVoucher.findMany({
        where,
        include: { grant: { select: { id: true, code: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.paymentVoucher.count({ where }),
    ]);

    return buildPaginationResponse(data, total, page, limit);
  }

  async findOneVoucher(id: string) {
    const userWithRoles = {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        roles: { include: { role: { select: { id: true, name: true } } } },
      },
    };

    const voucher = await this.prisma.paymentVoucher.findUnique({
      where: { id, deletedAt: null },
      include: {
        paymentRequest: { include: { invoice: true } },
        grant: true,
        payments: {
          include: {
            cheques: true,
            bankTransfers: true,
          },
        },
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
    if (!voucher) throw new NotFoundException(`Payment Voucher ${id} not found`);

    let createdBy = null;
    if (voucher.createdById) {
      createdBy = await this.prisma.user.findUnique({
        where: { id: voucher.createdById },
        ...userWithRoles,
      });
    }

    return { ...voucher, createdBy };
  }

  async createVoucher(dto: any, user: UserPayload) {
    const grant = await this.prisma.grant.findUnique({ where: { id: dto.grantId } });
    if (!grant) throw new NotFoundException('Grant not found');

    const serialNumber = await this.serialSvc.next(grant.code, 'PV');

    const voucher = await this.prisma.paymentVoucher.create({
      data: {
        serialNumber,
        paymentRequestId: dto.paymentRequestId,
        grantId: dto.grantId,
        payeeType: dto.payeeType || 'VENDOR',
        payeeId: dto.payeeId,
        payeeName: dto.payeeName,
        paymentDate: new Date(dto.paymentDate),
        currency: dto.currency || 'USD',
        amount: new Prisma.Decimal(dto.amount),
        exchangeRate: new Prisma.Decimal(dto.exchangeRate || '1'),
        baseAmount: new Prisma.Decimal(Number(dto.amount) * Number(dto.exchangeRate || 1)),
        description: dto.description,
        reference: dto.reference,
        status: DocumentStatus.DRAFT,
        createdById: user.id,
      },
    });

    await this.auditSvc.log({
      userId: user.id,
      action: 'CREATE',
      module: 'PAYMENTS',
      resource: 'PaymentVoucher',
      resourceId: voucher.id,
      newValues: { serialNumber, amount: voucher.amount, payeeName: voucher.payeeName },
    });

    return voucher;
  }

  async submitVoucher(id: string, user: UserPayload) {
    const voucher = await this.findOneVoucher(id);
    if (voucher.status !== DocumentStatus.DRAFT) throw new BadRequestException('Only DRAFT vouchers can be submitted');

    const workflowInstance = await this.workflowSvc.startWorkflow('PAYMENT_VOUCHER', id, user.id);

    return this.prisma.paymentVoucher.update({
      where: { id },
      data: { status: DocumentStatus.SUBMITTED, workflowInstanceId: workflowInstance?.id },
    });
  }

  async approveVoucher(id: string, comment: string | undefined, user: UserPayload) {
    const voucher = await this.findOneVoucher(id);
    if (!voucher.workflowInstanceId) throw new BadRequestException('No active workflow');

    const instance = await this.workflowSvc.processAction(
      voucher.workflowInstanceId,
      'APPROVE' as any,
      user.id,
      comment,
      { ipAddress: user.ipAddress, userAgent: user.userAgent },
    );

    if (instance.status === 'APPROVED') {
      await this.prisma.paymentVoucher.update({ where: { id }, data: { status: DocumentStatus.APPROVED } });
    }

    return instance;
  }

  async markPaid(id: string, dto: any, user: UserPayload) {
    const voucher = await this.findOneVoucher(id);
    if (voucher.status !== DocumentStatus.APPROVED) throw new BadRequestException('Voucher must be APPROVED to mark as paid');

    const payment = await this.prisma.payment.create({
      data: {
        paymentVoucherId: id,
        paymentMethod: dto.paymentMethod,
        paymentDate: new Date(dto.paymentDate),
        amount: voucher.amount,
        currency: voucher.currency,
        exchangeRate: voucher.exchangeRate,
        baseAmount: voucher.baseAmount,
        reference: dto.reference,
        bankAccountId: dto.bankAccountId,
        status: 'COMPLETED',
        createdById: user.id,
      },
    });

    if (dto.paymentMethod === 'CHEQUE' && dto.chequeData) {
      const chequeSerial = await this.serialSvc.next(voucher.grant?.code || 'SYS', 'CHQ');
      await this.prisma.cheque.create({
        data: {
          paymentId: payment.id,
          serialNumber: chequeSerial,
          chequeNumber: dto.chequeData.chequeNumber,
          bankAccountId: dto.chequeData.bankAccountId,
          payeeName: voucher.payeeName,
          amount: voucher.amount,
          currency: voucher.currency,
          chequeDate: new Date(dto.chequeData.chequeDate || dto.paymentDate),
          status: 'ISSUED',
          issuedAt: new Date(),
        },
      });
    } else if (dto.paymentMethod === 'BANK_TRANSFER' && dto.transferData) {
      const transferSerial = await this.serialSvc.next(voucher.grant?.code || 'SYS', 'BT');
      await this.prisma.bankTransfer.create({
        data: {
          paymentId: payment.id,
          serialNumber: transferSerial,
          fromBankAccountId: dto.transferData.fromBankAccountId,
          toBankAccount: dto.transferData.toBankAccount,
          toBankName: dto.transferData.toBankName,
          toAccountName: voucher.payeeName,
          currency: voucher.currency,
          amount: voucher.amount,
          exchangeRate: voucher.exchangeRate,
          baseAmount: voucher.baseAmount,
          transferDate: new Date(dto.paymentDate),
          reference: dto.reference,
          status: 'COMPLETED',
          completedAt: new Date(),
        },
      });
    }

    await this.prisma.paymentVoucher.update({ where: { id }, data: { status: 'PAID' as any } });

    await this.auditSvc.log({
      userId: user.id,
      action: 'UPDATE',
      module: 'PAYMENTS',
      resource: 'PaymentVoucher',
      resourceId: id,
      newValues: { status: 'PAID', paymentMethod: dto.paymentMethod },
    });

    return payment;
  }

  // CHEQUES
  async findAllCheques(query: any) {
    const { page, limit } = parsePagination(query);
    const { status } = query;
    const where: any = { ...(status && { status }) };

    const [data, total] = await Promise.all([
      this.prisma.cheque.findMany({
        where,
        include: { bankAccount: { select: { id: true, accountName: true, bankName: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.cheque.count({ where }),
    ]);

    return buildPaginationResponse(data, total, page, limit);
  }

  // BANK TRANSFERS
  async findAllTransfers(query: any) {
    const { page, limit } = parsePagination(query);
    const { status } = query;
    const where: any = { ...(status && { status }) };

    const [data, total] = await Promise.all([
      this.prisma.bankTransfer.findMany({
        where,
        include: { fromBankAccount: { select: { id: true, accountName: true, bankName: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.bankTransfer.count({ where }),
    ]);

    return buildPaginationResponse(data, total, page, limit);
  }

  async updateChequeStatus(id: string, status: string, user: UserPayload) {
    return this.prisma.cheque.update({
      where: { id },
      data: { status: status as any, ...(status === 'CLEARED' && { clearedAt: new Date() }) },
    });
  }
}
