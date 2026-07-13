import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PurchaseOrdersService } from './purchase-orders.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser, UserPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('Purchase Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller('procurement/purchase-orders')
export class PurchaseOrdersController {
  constructor(private readonly svc: PurchaseOrdersService) {}

  @Get() @RequirePermissions('PURCHASE_ORDERS:READ') findAll(@Query() q: any) { return this.svc.findAll(q); }
  @Post() @RequirePermissions('PURCHASE_ORDERS:CREATE') create(@Body() dto: any, @CurrentUser() user: UserPayload) { return this.svc.create(dto, user); }
  @Get(':id') @RequirePermissions('PURCHASE_ORDERS:READ') findOne(@Param('id') id: string) { return this.svc.findOne(id); }
  @Post(':id/submit') @RequirePermissions('PURCHASE_ORDERS:SUBMIT') submit(@Param('id') id: string, @CurrentUser() user: UserPayload) { return this.svc.submit(id, user); }
  @Post(':id/approve') @RequirePermissions('PURCHASE_ORDERS:APPROVE') approve(@Param('id') id: string, @Body() body: { comment?: string }, @CurrentUser() user: UserPayload) { return this.svc.approve(id, body.comment, user); }
  @Post(':id/issue') @RequirePermissions('PURCHASE_ORDERS:ISSUE') issue(@Param('id') id: string, @CurrentUser() user: UserPayload) { return this.svc.issue(id, user); }
  @Get(':id/payment-status') @RequirePermissions('PURCHASE_ORDERS:READ') paymentStatus(@Param('id') id: string) { return this.svc.getPaymentStatus(id); }
  @Delete(':id') @RequirePermissions('PURCHASE_ORDERS:DELETE') @HttpCode(HttpStatus.NO_CONTENT) remove(@Param('id') id: string, @CurrentUser() user: UserPayload) { return this.svc.softDelete(id, user); }
}
