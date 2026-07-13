import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ContractsService } from './contracts.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser, UserPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('Contracts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller('procurement/contracts')
export class ContractsController {
  constructor(private readonly svc: ContractsService) {}

  @Get() @RequirePermissions('CONTRACTS:READ') findAll(@Query() q: any) { return this.svc.findAll(q); }
  @Post() @RequirePermissions('CONTRACTS:CREATE') create(@Body() dto: any, @CurrentUser() user: UserPayload) { return this.svc.create(dto, user); }
  @Get('expiring') @RequirePermissions('CONTRACTS:READ') getExpiring(@Query('days') days: number) { return this.svc.getExpiring(Number(days) || 30); }
  @Get(':id') @RequirePermissions('CONTRACTS:READ') findOne(@Param('id') id: string) { return this.svc.findOne(id); }
  @Patch(':id') @RequirePermissions('CONTRACTS:UPDATE') update(@Param('id') id: string, @Body() dto: any, @CurrentUser() user: UserPayload) { return this.svc.update(id, dto, user); }
  @Post(':id/activate') @RequirePermissions('CONTRACTS:APPROVE') activate(@Param('id') id: string, @CurrentUser() user: UserPayload) { return this.svc.activate(id, user); }
  @Post(':id/terminate') @RequirePermissions('CONTRACTS:APPROVE') terminate(@Param('id') id: string, @Body() body: { reason: string }, @CurrentUser() user: UserPayload) { return this.svc.terminate(id, body.reason, user); }
  @Delete(':id') @RequirePermissions('CONTRACTS:DELETE') @HttpCode(HttpStatus.NO_CONTENT) remove(@Param('id') id: string, @CurrentUser() user: UserPayload) { return this.svc.softDelete(id, user); }
}
