import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RbacGuard } from '../common/guards/rbac.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller()
export class ReportsController {
  constructor(private readonly svc: ReportsService) {}

  @Get('dashboard/executive') @RequirePermissions('REPORTS:READ') executive() { return this.svc.getExecutiveDashboard(); }
  @Get('dashboard/finance') @RequirePermissions('FINANCE:READ') finance() { return this.svc.getFinanceDashboard(); }
  @Get('dashboard/procurement') @RequirePermissions('PROCUREMENT:READ') procurement() { return this.svc.getProcurementDashboard(); }
  @Get('finance/reports/budget-vs-actual') @RequirePermissions('FINANCE:READ') budgetVsActual(@Query('grantId') grantId: string) { return this.svc.getBudgetVsActual(grantId); }
  @Get('finance/reports/grant-statement') @RequirePermissions('FINANCE:READ') grantStatement(@Query('grantId') grantId: string) { return this.svc.getGrantStatement(grantId); }
}
