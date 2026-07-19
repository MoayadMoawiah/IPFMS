import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
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

  @Get('payment-vouchers') @RequirePermissions('PAYMENTS:READ') findVouchers(@Query() q: any) { return this.svc.findAllVouchers(q); }
  @Post('payment-vouchers') @RequirePermissions('PAYMENTS:CREATE') createVoucher(@Body() dto: any, @CurrentUser() user: UserPayload) { return this.svc.createVoucher(dto, user); }
  @Get('payment-vouchers/:id') @RequirePermissions('PAYMENTS:READ') findOneVoucher(@Param('id') id: string) { return this.svc.findOneVoucher(id); }
  @Post('payment-vouchers/:id/submit') @RequirePermissions('PAYMENTS:SUBMIT') submitVoucher(@Param('id') id: string, @CurrentUser() user: UserPayload) { return this.svc.submitVoucher(id, user); }
  @Post('payment-vouchers/:id/approve') @RequirePermissions('PAYMENTS:APPROVE') approveVoucher(@Param('id') id: string, @Body() body: { comment?: string }, @CurrentUser() user: UserPayload) { return this.svc.approveVoucher(id, body.comment, user); }
  @Post('payment-vouchers/:id/mark-paid') @RequirePermissions('PAYMENTS:PAY') markPaid(@Param('id') id: string, @Body() dto: any, @CurrentUser() user: UserPayload) { return this.svc.markPaid(id, dto, user); }

  @Get('cheques') @RequirePermissions('CHEQUES:READ') findCheques(@Query() q: any) { return this.svc.findAllCheques(q); }
  @Patch('cheques/:id/status') @RequirePermissions('CHEQUES:UPDATE') updateCheque(@Param('id') id: string, @Body() body: { status: string }, @CurrentUser() user: UserPayload) { return this.svc.updateChequeStatus(id, body.status, user); }

  @Get('bank-transfers') @RequirePermissions('BANK_TRANSFERS:READ') findTransfers(@Query() q: any) { return this.svc.findAllTransfers(q); }
}
