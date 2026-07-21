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
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { VendorInvoicesService } from './vendor-invoices.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser, UserPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('Vendor Invoices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller('procurement/vendor-invoices')
export class VendorInvoicesController {
  constructor(private readonly svc: VendorInvoicesService) {}

  @Get()
  @RequirePermissions('INVOICES:READ')
  @ApiOperation({ summary: 'List vendor invoices' })
  findAll(@Query() q: any) {
    return this.svc.findAll(q);
  }

  @Post()
  @RequirePermissions('INVOICES:CREATE')
  @ApiOperation({ summary: 'Create vendor invoice against a PO' })
  create(@Body() dto: any, @CurrentUser() user: UserPayload) {
    return this.svc.create(dto, user);
  }

  @Get(':id')
  @RequirePermissions('INVOICES:READ')
  findOne(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.svc.findOne(id, user);
  }

  @Post(':id/submit')
  @RequirePermissions('INVOICES:SUBMIT')
  @ApiOperation({ summary: 'Submit invoice for procurement matching workflow' })
  submit(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.svc.submit(id, user);
  }

  @Post(':id/approve')
  @RequirePermissions('INVOICES:APPROVE')
  @ApiOperation({ summary: 'Approve invoice workflow step' })
  approve(
    @Param('id') id: string,
    @Body() body: { comment?: string },
    @CurrentUser() user: UserPayload,
  ) {
    return this.svc.approve(id, body.comment, user);
  }

  @Delete(':id')
  @RequirePermissions('INVOICES:DELETE')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.svc.softDelete(id, user);
  }
}
