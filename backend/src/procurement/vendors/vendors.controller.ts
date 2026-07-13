import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { VendorsService } from './vendors.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser, UserPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('Vendors')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller('procurement/vendors')
export class VendorsController {
  constructor(private readonly svc: VendorsService) {}

  @Get() @RequirePermissions('VENDORS:READ') findAll(@Query() q: any) { return this.svc.findAll(q); }
  @Post() @RequirePermissions('VENDORS:CREATE') create(@Body() dto: any, @CurrentUser() user: UserPayload) { return this.svc.create(dto, user); }
  @Get('expiring-documents') @RequirePermissions('VENDORS:READ') getExpiring(@Query('days') days: number) { return this.svc.getExpiringDocuments(Number(days) || 30); }
  @Get(':id') @RequirePermissions('VENDORS:READ') findOne(@Param('id') id: string) { return this.svc.findOne(id); }
  @Patch(':id') @RequirePermissions('VENDORS:UPDATE') update(@Param('id') id: string, @Body() dto: any, @CurrentUser() user: UserPayload) { return this.svc.update(id, dto, user); }
  @Delete(':id') @RequirePermissions('VENDORS:DELETE') @HttpCode(HttpStatus.NO_CONTENT) remove(@Param('id') id: string, @CurrentUser() user: UserPayload) { return this.svc.softDelete(id, user); }
  @Post(':id/blacklist') @RequirePermissions('VENDORS:BLACKLIST') blacklist(@Param('id') id: string, @Body() body: { reason: string }, @CurrentUser() user: UserPayload) { return this.svc.blacklist(id, body.reason, user); }
  @Post(':id/remove-blacklist') @RequirePermissions('VENDORS:BLACKLIST') removeBlacklist(@Param('id') id: string, @CurrentUser() user: UserPayload) { return this.svc.removeBlacklist(id, user); }
  @Get(':id/documents') @RequirePermissions('VENDORS:READ') getDocs(@Param('id') id: string) { return this.svc.getDocuments(id); }
  @Post(':id/documents') @RequirePermissions('VENDORS:UPDATE') addDoc(@Param('id') id: string, @Body() dto: any, @CurrentUser() user: UserPayload) { return this.svc.addDocument(id, dto, user); }
}
