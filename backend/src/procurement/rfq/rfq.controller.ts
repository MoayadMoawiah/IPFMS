import {
  Controller, Get, Post, Patch, Body, Param, Query, UseGuards
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RfqService } from './rfq.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser, UserPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('RFQ')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller('procurement/rfq')
export class RfqController {
  constructor(private readonly svc: RfqService) {}

  @Get() @RequirePermissions('RFQ:READ') findAll(@Query() q: any) { return this.svc.findAll(q); }
  @Post() @RequirePermissions('RFQ:CREATE') create(@Body() dto: any, @CurrentUser() user: UserPayload) { return this.svc.create(dto, user); }
  @Get(':id') @RequirePermissions('RFQ:READ') findOne(@Param('id') id: string) { return this.svc.findOne(id); }
  @Post(':id/issue') @RequirePermissions('RFQ:UPDATE') issue(@Param('id') id: string, @CurrentUser() user: UserPayload) { return this.svc.issue(id, user); }
  @Post(':id/vendors') @RequirePermissions('RFQ:UPDATE') invite(@Param('id') id: string, @Body() body: { vendorId: string }, @CurrentUser() user: UserPayload) { return this.svc.inviteVendor(id, body.vendorId, user); }
  @Patch(':id/vendors/:rfqVendorId') @RequirePermissions('RFQ:UPDATE') updateQuotation(@Param('id') id: string, @Param('rfqVendorId') rfqVendorId: string, @Body() dto: any) { return this.svc.updateVendorQuotation(id, rfqVendorId, dto); }
  @Post(':id/vendors/:rfqVendorId/award') @RequirePermissions('RFQ:APPROVE') award(@Param('id') id: string, @Param('rfqVendorId') rfqVendorId: string, @CurrentUser() user: UserPayload) { return this.svc.awardVendor(id, rfqVendorId, user); }
  @Get(':id/comparison') @RequirePermissions('RFQ:READ') comparison(@Param('id') id: string) { return this.svc.getComparison(id); }
}
