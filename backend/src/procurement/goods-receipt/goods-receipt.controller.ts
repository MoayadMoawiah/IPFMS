import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { GoodsReceiptService } from './goods-receipt.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser, UserPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('Goods Receipts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller('procurement/goods-receipts')
export class GoodsReceiptController {
  constructor(private readonly svc: GoodsReceiptService) {}

  @Get() @RequirePermissions('GOODS_RECEIPTS:READ') findAll(@Query() q: any) { return this.svc.findAll(q); }
  @Post() @RequirePermissions('GOODS_RECEIPTS:CREATE') create(@Body() dto: any, @CurrentUser() user: UserPayload) { return this.svc.create(dto, user); }
  @Get(':id') @RequirePermissions('GOODS_RECEIPTS:READ') findOne(@Param('id') id: string) { return this.svc.findOne(id); }
  @Post(':id/submit') @RequirePermissions('GOODS_RECEIPTS:SUBMIT') submit(@Param('id') id: string, @CurrentUser() user: UserPayload) { return this.svc.submit(id, user); }
  @Post(':id/approve') @RequirePermissions('GOODS_RECEIPTS:APPROVE') approve(@Param('id') id: string, @Body() body: { comment?: string }, @CurrentUser() user: UserPayload) { return this.svc.approve(id, body.comment, user); }
  @Delete(':id') @RequirePermissions('GOODS_RECEIPTS:DELETE') @HttpCode(HttpStatus.NO_CONTENT) remove(@Param('id') id: string, @CurrentUser() user: UserPayload) { return this.svc.softDelete(id, user); }
}
