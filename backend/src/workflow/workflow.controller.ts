import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { WorkflowService } from './workflow.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RbacGuard } from '../common/guards/rbac.guard';
import { CurrentUser, UserPayload } from '../common/decorators/current-user.decorator';
import { WorkflowAction } from '@prisma/client';

class WorkflowActionDto {
  action: WorkflowAction;
  comment?: string;
}

@ApiTags('Workflow')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller('workflow')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Get('templates')
  @ApiOperation({ summary: 'List all workflow templates' })
  getTemplates() {
    return this.workflowService.getTemplates();
  }

  @Get('pending')
  @ApiOperation({ summary: 'Get my pending approval tasks' })
  getPending(@CurrentUser() user: UserPayload) {
    return this.workflowService.getPendingForUser(user.id, user.roles);
  }

  @Get('instances/:id')
  @ApiOperation({ summary: 'Get workflow instance details' })
  getInstance(@Param('id') id: string) {
    return this.workflowService.getInstance(id);
  }

  @Post('instances/:id/action')
  @ApiOperation({ summary: 'Process workflow action (approve/reject/return)' })
  processAction(
    @Param('id') id: string,
    @Body() dto: WorkflowActionDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.workflowService.processAction(id, dto.action, user.id, dto.comment, {
      ipAddress: user.ipAddress,
      userAgent: user.userAgent,
    });
  }
}
