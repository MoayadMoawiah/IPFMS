import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
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
  @RequirePermissions('PROCUREMENT:READ')
  @ApiOperation({ summary: 'List purchase requisitions' })
  findAll(@Query() query: any, @CurrentUser() user: UserPayload) { return this.svc.findAll(query, user); }

  @Post()
  @RequirePermissions('PROCUREMENT:CREATE')
  @ApiOperation({ summary: 'Create purchase requisition' })
  create(@Body() dto: any, @CurrentUser() user: UserPayload) { return this.svc.create(dto, user); }

  @Get(':id')
  @RequirePermissions('PROCUREMENT:READ')
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Patch(':id')
  @RequirePermissions('PROCUREMENT:UPDATE')
  update(@Param('id') id: string, @Body() dto: any, @CurrentUser() user: UserPayload) { return this.svc.update(id, dto, user); }

  @Delete(':id')
  @RequirePermissions('PROCUREMENT:DELETE')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @CurrentUser() user: UserPayload) { return this.svc.softDelete(id, user); }

  @Post(':id/submit')
  @RequirePermissions('PROCUREMENT:SUBMIT')
  @ApiOperation({ summary: 'Submit PR for approval' })
  submit(@Param('id') id: string, @CurrentUser() user: UserPayload) { return this.svc.submit(id, user); }

  @Post(':id/approve')
  @RequirePermissions('PROCUREMENT:APPROVE')
  approve(@Param('id') id: string, @Body() body: { comment?: string }, @CurrentUser() user: UserPayload) {
    return this.svc.approve(id, body.comment, user);
  }

  @Post(':id/reject')
  @RequirePermissions('PROCUREMENT:APPROVE')
  reject(@Param('id') id: string, @Body() body: { comment: string }, @CurrentUser() user: UserPayload) {
    return this.svc.reject(id, body.comment, user);
  }

  @Post(':id/return')
  @RequirePermissions('PROCUREMENT:APPROVE')
  return_(@Param('id') id: string, @Body() body: { comment: string }, @CurrentUser() user: UserPayload) {
    return this.svc.return_(id, body.comment, user);
  }

  @Get(':id/items')
  @RequirePermissions('PROCUREMENT:READ')
  getItems(@Param('id') id: string) { return this.svc.getItems(id); }

  @Post(':id/items')
  @RequirePermissions('PROCUREMENT:UPDATE')
  addItem(@Param('id') id: string, @Body() dto: any) { return this.svc.addItem(id, dto); }
}
