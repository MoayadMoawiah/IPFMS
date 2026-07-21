import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser, UserPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller('finance')
export class PaymentsController {
  constructor(private readonly svc: PaymentsService) {}

  // Payment Requests
  @Get('payment-requests')
  @RequirePermissions('PAYMENTS:READ')
  @ApiOperation({ summary: 'List payment requests' })
  findPaymentRequests(@Query() q: any) {
    return this.svc.findAllPaymentRequests(q);
  }

  @Post('payment-requests')
  @RequirePermissions('PAYMENTS:CREATE')
  @ApiOperation({ summary: 'Create payment request from approved invoice' })
  createPaymentRequest(@Body() dto: any, @CurrentUser() user: UserPayload) {
    return this.svc.createPaymentRequest(dto, user);
  }

  @Get('payment-requests/:id')
  @RequirePermissions('PAYMENTS:READ')
  findOnePaymentRequest(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.svc.findOnePaymentRequest(id, user);
  }

  @Patch('payment-requests/:id')
  @RequirePermissions('PAYMENTS:UPDATE')
  @ApiOperation({ summary: 'Update DRAFT/RETURNED payment request' })
  updatePaymentRequest(
    @Param('id') id: string,
    @Body() dto: any,
    @CurrentUser() user: UserPayload,
  ) {
    return this.svc.updatePaymentRequest(id, dto, user);
  }

  @Get('payment-requests/:id/cash-receipt')
  @RequirePermissions('PAYMENTS:READ')
  @ApiOperation({ summary: 'Cash receipt data for print/download' })
  getCashReceipt(@Param('id') id: string) {
    return this.svc.getCashReceipt(id);
  }

  @Post('payment-requests/:id/documents')
  @RequirePermissions('PAYMENTS:UPDATE')
  @ApiOperation({ summary: 'Upload documents to a payment request' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: memoryStorage(),
      limits: { fileSize: 20 * 1024 * 1024 },
    }),
  )
  uploadPaymentRequestDocuments(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body('labels') labelsJson: string,
    @CurrentUser() user: UserPayload,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }
    let labels: string[] = [];
    try {
      labels = labelsJson ? JSON.parse(labelsJson) : [];
    } catch {
      labels = [];
    }
    return this.svc.uploadPaymentRequestDocuments(id, files, labels, user);
  }

  @Get('payment-requests/:id/documents')
  @RequirePermissions('PAYMENTS:READ')
  @ApiOperation({ summary: 'List payment request documents' })
  listPaymentRequestDocuments(@Param('id') id: string) {
    return this.svc.listPaymentRequestDocuments(id);
  }

  @Get('payment-requests/:id/supporting-documents')
  @RequirePermissions('PAYMENTS:READ')
  @ApiOperation({
    summary:
      'List chain supporting documents (PR, PO, GRN, invoice, payment request) for finance approval',
  })
  listPaymentRequestSupportingDocuments(@Param('id') id: string) {
    return this.svc.listPaymentRequestSupportingDocuments(id);
  }

  @Delete('payment-requests/:id/documents/:attachmentId')
  @RequirePermissions('PAYMENTS:UPDATE')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a payment request document' })
  deletePaymentRequestDocument(
    @Param('id') id: string,
    @Param('attachmentId') attachmentId: string,
    @CurrentUser() user: UserPayload,
  ) {
    return this.svc.deletePaymentRequestDocument(id, attachmentId, user);
  }

  @Post('payment-requests/:id/submit')
  @RequirePermissions('PAYMENTS:SUBMIT')
  submitPaymentRequest(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.svc.submitPaymentRequest(id, user);
  }

  @Post('payment-requests/:id/approve')
  @RequirePermissions('PAYMENTS:APPROVE')
  approvePaymentRequest(
    @Param('id') id: string,
    @Body() body: { comment?: string },
    @CurrentUser() user: UserPayload,
  ) {
    return this.svc.approvePaymentRequest(id, body.comment, user);
  }

  // Payment Vouchers
  @Get('payment-vouchers')
  @RequirePermissions('PAYMENTS:READ')
  findVouchers(@Query() q: any) {
    return this.svc.findAllVouchers(q);
  }

  @Post('payment-vouchers')
  @RequirePermissions('PAYMENTS:CREATE')
  createVoucher(@Body() dto: any, @CurrentUser() user: UserPayload) {
    return this.svc.createVoucher(dto, user);
  }

  @Get('payment-vouchers/:id')
  @RequirePermissions('PAYMENTS:READ')
  findOneVoucher(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.svc.findOneVoucher(id, user);
  }

  @Get('payment-vouchers/:id/supporting-documents')
  @RequirePermissions('PAYMENTS:READ')
  @ApiOperation({
    summary:
      'List chain supporting documents for a payment voucher (via linked payment request)',
  })
  listPaymentVoucherSupportingDocuments(@Param('id') id: string) {
    return this.svc.listPaymentVoucherSupportingDocuments(id);
  }

  @Get('payment-vouchers/:id/documents')
  @RequirePermissions('PAYMENTS:READ')
  @ApiOperation({ summary: 'List payment voucher own documents' })
  listPaymentVoucherDocuments(@Param('id') id: string) {
    return this.svc.listPaymentVoucherDocuments(id);
  }

  @Post('payment-vouchers/:id/documents')
  @RequirePermissions('PAYMENTS:UPDATE')
  @ApiOperation({ summary: 'Upload documents to a payment voucher' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: memoryStorage(),
      limits: { fileSize: 20 * 1024 * 1024 },
    }),
  )
  uploadPaymentVoucherDocuments(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body('labels') labelsJson: string,
    @CurrentUser() user: UserPayload,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }
    let labels: string[] = [];
    try {
      labels = labelsJson ? JSON.parse(labelsJson) : [];
    } catch {
      labels = [];
    }
    return this.svc.uploadPaymentVoucherDocuments(id, files, labels, user);
  }

  @Delete('payment-vouchers/:id/documents/:attachmentId')
  @RequirePermissions('PAYMENTS:UPDATE')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a payment voucher document' })
  deletePaymentVoucherDocument(
    @Param('id') id: string,
    @Param('attachmentId') attachmentId: string,
    @CurrentUser() user: UserPayload,
  ) {
    return this.svc.deletePaymentVoucherDocument(id, attachmentId, user);
  }

  @Post('payment-vouchers/:id/submit')
  @RequirePermissions('PAYMENTS:SUBMIT')
  submitVoucher(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.svc.submitVoucher(id, user);
  }

  @Post('payment-vouchers/:id/approve')
  @RequirePermissions('PAYMENTS:APPROVE')
  approveVoucher(
    @Param('id') id: string,
    @Body() body: { comment?: string },
    @CurrentUser() user: UserPayload,
  ) {
    return this.svc.approveVoucher(id, body.comment, user);
  }

  @Post('payment-vouchers/:id/mark-paid')
  @RequirePermissions('PAYMENTS:PAY')
  markPaid(@Param('id') id: string, @Body() dto: any, @CurrentUser() user: UserPayload) {
    return this.svc.markPaid(id, dto, user);
  }

  @Get('bank-accounts')
  @RequirePermissions('BANK_ACCOUNTS:READ')
  @ApiOperation({ summary: 'List active organisation bank accounts' })
  findBankAccounts() {
    return this.svc.findActiveBankAccounts();
  }

  @Get('cheques')
  @RequirePermissions('CHEQUES:READ')
  findCheques(@Query() q: any) {
    return this.svc.findAllCheques(q);
  }

  @Patch('cheques/:id/status')
  @RequirePermissions('CHEQUES:UPDATE')
  updateCheque(
    @Param('id') id: string,
    @Body() body: { status: string },
    @CurrentUser() user: UserPayload,
  ) {
    return this.svc.updateChequeStatus(id, body.status, user);
  }

  @Get('bank-transfers')
  @RequirePermissions('BANK_TRANSFERS:READ')
  findTransfers(@Query() q: any) {
    return this.svc.findAllTransfers(q);
  }
}
