import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JournalEntriesService } from './journal-entries.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser, UserPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('Journal Entries')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller('finance/journal-entries')
export class JournalEntriesController {
  constructor(private readonly svc: JournalEntriesService) {}

  @Get() @RequirePermissions('JOURNAL_ENTRIES:READ') findAll(@Query() q: any) { return this.svc.findAll(q); }
  @Post() @RequirePermissions('JOURNAL_ENTRIES:CREATE') create(@Body() dto: any, @CurrentUser() user: UserPayload) { return this.svc.create(dto, user); }
  @Get('trial-balance') @RequirePermissions('JOURNAL_ENTRIES:READ') trialBalance(@Query('periodId') periodId: string, @Query('grantId') grantId: string) { return this.svc.getTrialBalance(periodId, grantId); }
  @Get(':id') @RequirePermissions('JOURNAL_ENTRIES:READ') findOne(@Param('id') id: string) { return this.svc.findOne(id); }
  @Post(':id/post') @RequirePermissions('JOURNAL_ENTRIES:POST') post(@Param('id') id: string, @CurrentUser() user: UserPayload) { return this.svc.post(id, user); }
  @Post(':id/reverse') @RequirePermissions('JOURNAL_ENTRIES:REVERSE') reverse(@Param('id') id: string, @CurrentUser() user: UserPayload) { return this.svc.reverse(id, user); }
}
