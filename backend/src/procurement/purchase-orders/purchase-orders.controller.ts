import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
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

  @Get()
  @RequirePermissions('PURCHASE_ORDERS:READ')
  findAll(@Query() q: any) {
    return this.svc.findAll(q);
  }

  @Post()
  @RequirePermissions('PURCHASE_ORDERS:CREATE')
  create(@Body() dto: any, @CurrentUser() user: UserPayload) {
    return this.svc.create(dto, user);
  }

  @Get(':id')
  @RequirePermissions('PURCHASE_ORDERS:READ')
  findOne(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.svc.findOne(id, user);
  }

  @Post(':id/submit')
  @RequirePermissions('PURCHASE_ORDERS:SUBMIT')
  submit(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.svc.submit(id, user);
  }

  /** Workflow step assignment is enforced in WorkflowService; any workflow approver may call this. */
  @Post(':id/approve')
  @RequirePermissions('WORKFLOW:APPROVE')
  approve(
    @Param('id') id: string,
    @Body() body: { comment?: string },
    @CurrentUser() user: UserPayload,
  ) {
    return this.svc.approve(id, body.comment, user);
  }

  @Post(':id/reject')
  @RequirePermissions('WORKFLOW:APPROVE')
  reject(
    @Param('id') id: string,
    @Body() body: { comment: string },
    @CurrentUser() user: UserPayload,
  ) {
    return this.svc.reject(id, body.comment, user);
  }

  @Post(':id/return')
  @RequirePermissions('WORKFLOW:APPROVE')
  return_(
    @Param('id') id: string,
    @Body() body: { comment: string },
    @CurrentUser() user: UserPayload,
  ) {
    return this.svc.return_(id, body.comment, user);
  }

  @Post(':id/issue')
  @RequirePermissions('PURCHASE_ORDERS:ISSUE')
  issue(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.svc.issue(id, user);
  }

  @Get(':id/payment-status')
  @RequirePermissions('PURCHASE_ORDERS:READ')
  paymentStatus(@Param('id') id: string) {
    return this.svc.getPaymentStatus(id);
  }

  @Post(':id/documents')
  @RequirePermissions('PURCHASE_ORDERS:UPDATE')
  @ApiOperation({ summary: 'Upload documents to a purchase order' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: memoryStorage(),
      limits: { fileSize: 20 * 1024 * 1024 },
    }),
  )
  uploadDocuments(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body('labels') labelsJson: string,
    @CurrentUser() user: UserPayload,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }
    let labels: string[] = [];
    try {
      labels = labelsJson ? JSON.parse(labelsJson) : [];
    } catch {
      labels = [];
    }
    return this.svc.uploadDocuments(id, files, labels, user);
  }

  @Get(':id/documents')
  @RequirePermissions('PURCHASE_ORDERS:READ')
  @ApiOperation({ summary: 'List documents attached to a purchase order' })
  listDocuments(@Param('id') id: string) {
    return this.svc.listDocuments(id);
  }

  @Delete(':id/documents/:attachmentId')
  @RequirePermissions('PURCHASE_ORDERS:UPDATE')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a document from a purchase order' })
  deleteDocument(
    @Param('id') id: string,
    @Param('attachmentId') attachmentId: string,
    @CurrentUser() user: UserPayload,
  ) {
    return this.svc.deleteDocument(id, attachmentId, user);
  }

  @Delete(':id')
  @RequirePermissions('PURCHASE_ORDERS:DELETE')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.svc.softDelete(id, user);
  }
}
