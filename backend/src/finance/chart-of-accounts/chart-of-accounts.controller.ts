import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ChartOfAccountsService } from './chart-of-accounts.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';

@ApiTags('Finance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller('finance/accounts')
export class ChartOfAccountsController {
  constructor(private readonly svc: ChartOfAccountsService) {}

  @Get() @RequirePermissions('CHART_OF_ACCOUNTS:READ') findAll(@Query() q: any) { return this.svc.findAll(q); }
  @Get('tree') @RequirePermissions('CHART_OF_ACCOUNTS:READ') getTree() { return this.svc.getTree(); }
  @Post() @RequirePermissions('CHART_OF_ACCOUNTS:CREATE') create(@Body() dto: any) { return this.svc.create(dto); }
  @Get(':id') @RequirePermissions('CHART_OF_ACCOUNTS:READ') findOne(@Param('id') id: string) { return this.svc.findOne(id); }
  @Get(':id/ledger') @RequirePermissions('CHART_OF_ACCOUNTS:READ') getLedger(@Param('id') id: string, @Query() q: any) { return this.svc.getLedger(id, q); }
  @Patch(':id') @RequirePermissions('CHART_OF_ACCOUNTS:UPDATE') update(@Param('id') id: string, @Body() dto: any) { return this.svc.update(id, dto); }
  @Delete(':id') @RequirePermissions('CHART_OF_ACCOUNTS:DELETE') @HttpCode(HttpStatus.NO_CONTENT) remove(@Param('id') id: string) { return this.svc.softDelete(id); }
}
