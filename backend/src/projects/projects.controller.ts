import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus,
  UseInterceptors, UploadedFiles, BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RbacGuard } from '../common/guards/rbac.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { CurrentUser, UserPayload } from '../common/decorators/current-user.decorator';
import { CreateActivityDto, UpdateActivityDto, UpdateActivityProgressDto } from './dto/create-activity.dto';

@ApiTags('Projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // ── Activity routes (must be before :id routes) ───────────────────────────

  @Get('activities')
  @RequirePermissions('ACTIVITIES:READ')
  @ApiOperation({ summary: 'List activities across projects/grants' })
  findActivities(@Query() query: any) {
    return this.projectsService.findActivities(query);
  }

  @Post('activities')
  @RequirePermissions('ACTIVITIES:CREATE')
  @ApiOperation({ summary: 'Create activity under a grant/project' })
  createActivity(@Body() dto: CreateActivityDto, @CurrentUser() user: UserPayload) {
    return this.projectsService.createActivity(dto, user);
  }

  @Get('activities/:id')
  @RequirePermissions('ACTIVITIES:READ')
  @ApiOperation({ summary: 'Get activity detail' })
  findActivity(@Param('id') id: string) {
    return this.projectsService.findActivity(id);
  }

  @Patch('activities/:id')
  @RequirePermissions('ACTIVITIES:UPDATE')
  @ApiOperation({ summary: 'Update activity' })
  updateActivity(
    @Param('id') id: string,
    @Body() dto: UpdateActivityDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.projectsService.updateActivity(id, dto, user);
  }

  @Patch('activities/:id/progress')
  @RequirePermissions('ACTIVITIES:UPDATE')
  @ApiOperation({ summary: 'Update activity progress percentage' })
  updateActivityProgress(
    @Param('id') id: string,
    @Body() dto: UpdateActivityProgressDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.projectsService.updateProgress(id, dto.progressPercent, user);
  }

  @Delete('activities/:id')
  @RequirePermissions('ACTIVITIES:DELETE')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete activity' })
  removeActivity(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.projectsService.softDeleteActivity(id, user);
  }

  @Post('activities/:id/documents')
  @RequirePermissions('ACTIVITIES:UPDATE')
  @ApiOperation({ summary: 'Upload documents to an activity' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: memoryStorage(),
      limits: { fileSize: 20 * 1024 * 1024 },
    }),
  )
  uploadActivityDocuments(
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
    return this.projectsService.uploadActivityDocuments(id, files, labels, user);
  }

  @Get('activities/:id/documents')
  @RequirePermissions('ACTIVITIES:READ')
  @ApiOperation({ summary: 'List documents attached to an activity' })
  listActivityDocuments(@Param('id') id: string) {
    return this.projectsService.listActivityDocuments(id);
  }

  @Delete('activities/:id/documents/:attachmentId')
  @RequirePermissions('ACTIVITIES:UPDATE')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a document from an activity' })
  deleteActivityDocument(
    @Param('id') id: string,
    @Param('attachmentId') attachmentId: string,
    @CurrentUser() user: UserPayload,
  ) {
    return this.projectsService.deleteActivityDocument(id, attachmentId, user);
  }

  // ── Project routes ────────────────────────────────────────────────────────

  @Get()
  @RequirePermissions('PROJECTS:READ')
  findAll(@Query() query: any) { return this.projectsService.findAll(query); }

  @Post()
  @RequirePermissions('PROJECTS:CREATE')
  create(@Body() dto: any, @CurrentUser() user: UserPayload) { return this.projectsService.create(dto, user); }

  @Get(':id')
  @RequirePermissions('PROJECTS:READ')
  findOne(@Param('id') id: string) { return this.projectsService.findOne(id); }

  @Patch(':id')
  @RequirePermissions('PROJECTS:UPDATE')
  update(@Param('id') id: string, @Body() dto: any, @CurrentUser() user: UserPayload) {
    return this.projectsService.update(id, dto, user);
  }

  @Delete(':id')
  @RequirePermissions('PROJECTS:DELETE')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.projectsService.softDelete(id, user);
  }

  @Get(':id/milestones')
  @RequirePermissions('PROJECTS:READ')
  getMilestones(@Param('id') id: string) { return this.projectsService.getMilestones(id); }

  @Post(':id/milestones')
  @RequirePermissions('PROJECTS:UPDATE')
  addMilestone(@Param('id') id: string, @Body() dto: any, @CurrentUser() user: UserPayload) {
    return this.projectsService.addMilestone(id, dto, user);
  }

  @Post(':id/milestones/:mid/complete')
  @RequirePermissions('PROJECTS:UPDATE')
  completeMilestone(@Param('id') id: string, @Param('mid') mid: string, @CurrentUser() user: UserPayload) {
    return this.projectsService.completeMilestone(id, mid, user);
  }
}
