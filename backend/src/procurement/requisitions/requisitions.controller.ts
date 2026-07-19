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
  UseInterceptors,
  UploadedFiles,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { RequisitionsService } from './requisitions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser, UserPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('Requisitions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller('procurement/requisitions')
export class RequisitionsController {
  constructor(private readonly svc: RequisitionsService) {}

  @Get()
  @RequirePermissions('PURCHASE_REQUISITIONS:READ')
  @ApiOperation({ summary: 'List purchase requisitions' })
  findAll(@Query() query: any, @CurrentUser() user: UserPayload) { return this.svc.findAll(query, user); }

  @Post()
  @RequirePermissions('PURCHASE_REQUISITIONS:CREATE')
  @ApiOperation({ summary: 'Create purchase requisition' })
  create(@Body() dto: any, @CurrentUser() user: UserPayload) { return this.svc.create(dto, user); }

  @Get(':id')
  @RequirePermissions('PURCHASE_REQUISITIONS:READ')
  findOne(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.svc.findOne(id, user);
  }

  @Patch(':id')
  @RequirePermissions('PURCHASE_REQUISITIONS:UPDATE')
  update(@Param('id') id: string, @Body() dto: any, @CurrentUser() user: UserPayload) { return this.svc.update(id, dto, user); }

  @Delete(':id')
  @RequirePermissions('PURCHASE_REQUISITIONS:DELETE')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @CurrentUser() user: UserPayload) { return this.svc.softDelete(id, user); }

  @Post(':id/submit')
  @RequirePermissions('PURCHASE_REQUISITIONS:SUBMIT')
  @ApiOperation({ summary: 'Submit PR for approval' })
  submit(@Param('id') id: string, @CurrentUser() user: UserPayload) { return this.svc.submit(id, user); }

  @Post(':id/approve')
  @RequirePermissions('PURCHASE_REQUISITIONS:APPROVE')
  approve(@Param('id') id: string, @Body() body: { comment?: string }, @CurrentUser() user: UserPayload) {
    return this.svc.approve(id, body.comment, user);
  }

  @Post(':id/reject')
  @RequirePermissions('PURCHASE_REQUISITIONS:APPROVE')
  reject(@Param('id') id: string, @Body() body: { comment: string }, @CurrentUser() user: UserPayload) {
    return this.svc.reject(id, body.comment, user);
  }

  @Post(':id/return')
  @RequirePermissions('PURCHASE_REQUISITIONS:APPROVE')
  return_(@Param('id') id: string, @Body() body: { comment: string }, @CurrentUser() user: UserPayload) {
    return this.svc.return_(id, body.comment, user);
  }

  @Get(':id/items')
  @RequirePermissions('PURCHASE_REQUISITIONS:READ')
  getItems(@Param('id') id: string) { return this.svc.getItems(id); }

  @Post(':id/items')
  @RequirePermissions('PURCHASE_REQUISITIONS:UPDATE')
  addItem(@Param('id') id: string, @Body() dto: any) { return this.svc.addItem(id, dto); }

  @Post(':id/documents')
  @RequirePermissions('PURCHASE_REQUISITIONS:UPDATE')
  @ApiOperation({ summary: 'Upload documents to a purchase requisition' })
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
  @RequirePermissions('PURCHASE_REQUISITIONS:READ')
  @ApiOperation({ summary: 'List documents attached to a purchase requisition' })
  listDocuments(@Param('id') id: string) {
    return this.svc.listDocuments(id);
  }

  @Delete(':id/documents/:attachmentId')
  @RequirePermissions('PURCHASE_REQUISITIONS:UPDATE')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a document from a purchase requisition' })
  deleteDocument(
    @Param('id') id: string,
    @Param('attachmentId') attachmentId: string,
    @CurrentUser() user: UserPayload,
  ) {
    return this.svc.deleteDocument(id, attachmentId, user);
  }
}
