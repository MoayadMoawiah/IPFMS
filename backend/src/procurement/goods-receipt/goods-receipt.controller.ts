import {
  Controller,
  Get,
  Post,
  Patch,
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

  @Get()
  @RequirePermissions('GOODS_RECEIPTS:READ')
  findAll(@Query() q: any) {
    return this.svc.findAll(q);
  }

  @Post()
  @RequirePermissions('GOODS_RECEIPTS:CREATE')
  create(@Body() dto: any, @CurrentUser() user: UserPayload) {
    return this.svc.create(dto, user);
  }

  @Get(':id')
  @RequirePermissions('GOODS_RECEIPTS:READ')
  findOne(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.svc.findOne(id, user);
  }

  @Patch(':id')
  @RequirePermissions('GOODS_RECEIPTS:UPDATE')
  @ApiOperation({ summary: 'Update a DRAFT or RETURNED goods receipt' })
  update(
    @Param('id') id: string,
    @Body() dto: any,
    @CurrentUser() user: UserPayload,
  ) {
    return this.svc.update(id, dto, user);
  }

  @Post(':id/submit')
  @RequirePermissions('GOODS_RECEIPTS:SUBMIT')
  submit(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.svc.submit(id, user);
  }

  @Post(':id/approve')
  @RequirePermissions('GOODS_RECEIPTS:APPROVE')
  approve(
    @Param('id') id: string,
    @Body() body: { comment?: string },
    @CurrentUser() user: UserPayload,
  ) {
    return this.svc.approve(id, body.comment, user);
  }

  @Post(':id/reject')
  @RequirePermissions('GOODS_RECEIPTS:APPROVE')
  reject(
    @Param('id') id: string,
    @Body() body: { comment: string },
    @CurrentUser() user: UserPayload,
  ) {
    return this.svc.reject(id, body.comment, user);
  }

  @Post(':id/return')
  @RequirePermissions('GOODS_RECEIPTS:APPROVE')
  return_(
    @Param('id') id: string,
    @Body() body: { comment: string },
    @CurrentUser() user: UserPayload,
  ) {
    return this.svc.return_(id, body.comment, user);
  }

  @Post(':id/documents')
  @RequirePermissions('GOODS_RECEIPTS:UPDATE')
  @ApiOperation({ summary: 'Upload documents to a goods receipt' })
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
  @RequirePermissions('GOODS_RECEIPTS:READ')
  @ApiOperation({ summary: 'List documents attached to a goods receipt' })
  listDocuments(@Param('id') id: string) {
    return this.svc.listDocuments(id);
  }

  @Delete(':id/documents/:attachmentId')
  @RequirePermissions('GOODS_RECEIPTS:UPDATE')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a document from a goods receipt' })
  deleteDocument(
    @Param('id') id: string,
    @Param('attachmentId') attachmentId: string,
    @CurrentUser() user: UserPayload,
  ) {
    return this.svc.deleteDocument(id, attachmentId, user);
  }

  @Delete(':id')
  @RequirePermissions('GOODS_RECEIPTS:DELETE')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.svc.softDelete(id, user);
  }
}
