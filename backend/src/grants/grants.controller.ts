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
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { GrantsService } from './grants.service';
import { CreateGrantDto } from './dto/create-grant.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RbacGuard } from '../common/guards/rbac.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { CurrentUser, UserPayload } from '../common/decorators/current-user.decorator';

@ApiTags('Grants')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller('grants')
export class GrantsController {
  constructor(private readonly grantsService: GrantsService) {}

  @Get()
  @RequirePermissions('GRANTS:READ')
  @ApiOperation({ summary: 'List all grants' })
  findAll(@Query() query: any, @CurrentUser() user: UserPayload) {
    return this.grantsService.findAll(query, user);
  }

  @Post()
  @RequirePermissions('GRANTS:CREATE')
  @ApiOperation({ summary: 'Create a new grant' })
  create(@Body() dto: CreateGrantDto, @CurrentUser() user: UserPayload) {
    return this.grantsService.create(dto, user);
  }

  @Get(':id')
  @RequirePermissions('GRANTS:READ')
  @ApiOperation({ summary: 'Get grant detail' })
  findOne(@Param('id') id: string) {
    return this.grantsService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions('GRANTS:UPDATE')
  @ApiOperation({ summary: 'Update grant' })
  update(@Param('id') id: string, @Body() dto: Partial<CreateGrantDto>, @CurrentUser() user: UserPayload) {
    return this.grantsService.update(id, dto, user);
  }

  @Delete(':id')
  @RequirePermissions('GRANTS:DELETE')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete grant' })
  remove(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.grantsService.softDelete(id, user);
  }

  @Post(':id/activate')
  @RequirePermissions('GRANTS:APPROVE')
  @ApiOperation({ summary: 'Activate grant (DRAFT → ACTIVE)' })
  activate(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.grantsService.activate(id, user);
  }

  @Post(':id/close')
  @RequirePermissions('GRANTS:APPROVE')
  @ApiOperation({ summary: 'Close grant' })
  close(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.grantsService.close(id, user);
  }

  @Get(':id/budget')
  @RequirePermissions('GRANTS:READ')
  @ApiOperation({ summary: 'Get grant budget summary' })
  getBudget(@Param('id') id: string) {
    return this.grantsService.getBudgetSummary(id);
  }

  @Get(':id/budget/lines')
  @RequirePermissions('GRANTS:READ')
  @ApiOperation({ summary: 'Get grant budget lines' })
  getBudgetLines(@Param('id') id: string) {
    return this.grantsService.getBudgetSummary(id);
  }

  @Post(':id/budget/lines')
  @RequirePermissions('GRANTS:UPDATE')
  @ApiOperation({ summary: 'Add budget line to grant' })
  addBudgetLine(@Param('id') id: string, @Body() dto: any, @CurrentUser() user: UserPayload) {
    return this.grantsService.addBudgetLine(id, dto, user);
  }

  // ─── Document endpoints ──────────────────────────────────────────────────

  @Post(':id/documents')
  @RequirePermissions('GRANTS:UPDATE')
  @ApiOperation({ summary: 'Upload documents to a grant' })
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
    return this.grantsService.uploadDocuments(id, files, labels, user);
  }

  @Get(':id/documents')
  @RequirePermissions('GRANTS:READ')
  @ApiOperation({ summary: 'List documents attached to a grant' })
  listDocuments(@Param('id') id: string) {
    return this.grantsService.listDocuments(id);
  }

  @Delete(':id/documents/:attachmentId')
  @RequirePermissions('GRANTS:UPDATE')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a document from a grant' })
  deleteDocument(
    @Param('id') id: string,
    @Param('attachmentId') attachmentId: string,
    @CurrentUser() user: UserPayload,
  ) {
    return this.grantsService.deleteDocument(id, attachmentId, user);
  }
}
