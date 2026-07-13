import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DonorsService } from './donors.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RbacGuard } from '../common/guards/rbac.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';

@ApiTags('Donors')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller('donors')
export class DonorsController {
  constructor(private readonly donorsService: DonorsService) {}

  @Get()
  @RequirePermissions('GRANTS:READ')
  @ApiOperation({ summary: 'List all donors' })
  findAll(@Query() query: any) {
    return this.donorsService.findAll(query);
  }

  @Post()
  @RequirePermissions('GRANTS:CREATE')
  @ApiOperation({ summary: 'Create a new donor' })
  create(@Body() dto: any) {
    return this.donorsService.create(dto);
  }

  @Get(':id')
  @RequirePermissions('GRANTS:READ')
  @ApiOperation({ summary: 'Get donor detail with grants' })
  findOne(@Param('id') id: string) {
    return this.donorsService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions('GRANTS:UPDATE')
  @ApiOperation({ summary: 'Update donor' })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.donorsService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('DONORS:DELETE')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete donor' })
  remove(@Param('id') id: string) {
    return this.donorsService.softDelete(id);
  }
}
