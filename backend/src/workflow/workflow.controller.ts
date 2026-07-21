import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { WorkflowService } from './workflow.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RbacGuard } from '../common/guards/rbac.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { CurrentUser, UserPayload } from '../common/decorators/current-user.decorator';
import { WorkflowAction } from '@prisma/client';
import {
  AdminCommentDto,
  AdminMoveDto,
  AdminReopenDto,
  AdminSetStepDto,
} from './dto/workflow-admin.dto';

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

  @Get('admin/board')
  @RequirePermissions('WORKFLOW:OVERRIDE')
  @ApiOperation({ summary: 'Super Admin Kanban board for a document type' })
  getAdminBoard(@Query('documentType') documentType: string) {
    return this.workflowService.getAdminBoard(documentType);
  }

  @Post('admin/instances/:id/move')
  @RequirePermissions('WORKFLOW:OVERRIDE')
  @ApiOperation({ summary: 'Force move workflow one step forward or back' })
  adminMove(
    @Param('id') id: string,
    @Body() dto: AdminMoveDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.workflowService.adminMove(id, dto.direction, user.id, dto.comment);
  }

  @Post('admin/instances/:id/set-step')
  @RequirePermissions('WORKFLOW:OVERRIDE')
  @ApiOperation({ summary: 'Force jump workflow to a specific step' })
  adminSetStep(
    @Param('id') id: string,
    @Body() dto: AdminSetStepDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.workflowService.adminSetStep(
      id,
      Number(dto.stepNumber),
      user.id,
      dto.comment,
    );
  }

  @Post('admin/instances/:id/return-to-requester')
  @RequirePermissions('WORKFLOW:OVERRIDE')
  @ApiOperation({ summary: 'Force return document to requester' })
  adminReturn(
    @Param('id') id: string,
    @Body() dto: AdminCommentDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.workflowService.adminReturnToRequester(id, user.id, dto.comment);
  }

  @Post('admin/reopen')
  @RequirePermissions('WORKFLOW:OVERRIDE')
  @ApiOperation({ summary: 'Reopen a finished workflow into IN_PROGRESS' })
  adminReopen(@Body() dto: AdminReopenDto, @CurrentUser() user: UserPayload) {
    return this.workflowService.adminReopen(
      dto.documentType,
      dto.documentId,
      user.id,
      dto.comment,
      dto.stepNumber,
    );
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
