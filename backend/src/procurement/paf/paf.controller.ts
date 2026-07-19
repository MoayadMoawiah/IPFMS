import {
  Controller, Get, Post, Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PafService } from './paf.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser, UserPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('PAF')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller('procurement/paf')
export class PafController {
  constructor(private readonly svc: PafService) {}

  @Get()
  @RequirePermissions('RFQ:READ')
  @ApiOperation({ summary: 'List purchase analysis forms' })
  findAll(@Query() q: { rfqId?: string; prId?: string; page?: number; limit?: number }) {
    return this.svc.findAll(q);
  }

  @Post()
  @RequirePermissions('RFQ:APPROVE')
  @ApiOperation({ summary: 'Create draft PAF from awarded RFQ' })
  create(@Body() dto: {
    rfqId: string;
    rfqVendorId: string;
    justification: string;
    committeeMembers?: { name: string; role: string }[];
  }, @CurrentUser() user: UserPayload) {
    return this.svc.create(dto, user);
  }

  @Get(':id')
  @RequirePermissions('RFQ:READ')
  @ApiOperation({ summary: 'Get PAF by id' })
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id);
  }
}
