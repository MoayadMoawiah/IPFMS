import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AssetsService } from './assets.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RbacGuard } from '../common/guards/rbac.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { CurrentUser, UserPayload } from '../common/decorators/current-user.decorator';

@ApiTags('Assets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller('assets')
export class AssetsController {
  constructor(private readonly svc: AssetsService) {}

  @Get() @RequirePermissions('ASSETS:READ') findAll(@Query() q: any) { return this.svc.findAll(q); }
  @Post() @RequirePermissions('ASSETS:CREATE') create(@Body() dto: any, @CurrentUser() user: UserPayload) { return this.svc.create(dto, user); }
  @Get('categories') @RequirePermissions('ASSETS:READ') getCategories() { return this.svc.getCategories(); }
  @Post('categories') @RequirePermissions('ASSETS:CREATE') createCategory(@Body() dto: any) { return this.svc.createCategory(dto); }
  @Get(':id') @RequirePermissions('ASSETS:READ') findOne(@Param('id') id: string) { return this.svc.findOne(id); }
  @Post(':id/assign') @RequirePermissions('ASSETS:UPDATE') assign(@Param('id') id: string, @Body() dto: any, @CurrentUser() user: UserPayload) { return this.svc.assign(id, dto, user); }
  @Post(':id/depreciate') @RequirePermissions('ASSETS:UPDATE') depreciate(@Param('id') id: string, @Body() body: { periodId: string }, @CurrentUser() user: UserPayload) { return this.svc.depreciate(id, body.periodId, user); }
  @Get(':id/depreciation') @RequirePermissions('ASSETS:READ') getDepreciation(@Param('id') id: string) { return this.svc.getDepreciationSchedule(id); }
  @Delete(':id') @RequirePermissions('ASSETS:DELETE') @HttpCode(HttpStatus.NO_CONTENT) remove(@Param('id') id: string, @CurrentUser() user: UserPayload) { return this.svc.softDelete(id, user); }
}
