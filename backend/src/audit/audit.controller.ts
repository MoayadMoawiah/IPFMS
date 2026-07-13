import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RbacGuard } from '../common/guards/rbac.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { AuditAction } from '@prisma/client';

@ApiTags('Audit')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @RequirePermissions('AUDIT:READ')
  @ApiOperation({ summary: 'List audit logs with filters' })
  findAll(
    @Query('userId') userId?: string,
    @Query('module') module?: string,
    @Query('resource') resource?: string,
    @Query('action') action?: AuditAction,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.auditService.findAll({
      userId,
      module,
      resource,
      action,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      page: Number(page) || 1,
      limit: Number(limit) || 50,
    });
  }

  @Get(':documentType/:documentId')
  @RequirePermissions('AUDIT:READ')
  @ApiOperation({ summary: 'Get audit trail for a specific document' })
  findByDocument(
    @Param('documentType') documentType: string,
    @Param('documentId') documentId: string,
  ) {
    return this.auditService.findByDocument(documentType, documentId);
  }
}
