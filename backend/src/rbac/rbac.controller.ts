import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RbacService } from './rbac.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RbacGuard } from '../common/guards/rbac.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';

@ApiTags('Roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller()
export class RbacController {
  constructor(private readonly rbacService: RbacService) {}

  @Get('roles')
  @RequirePermissions('ROLES:READ')
  @ApiOperation({ summary: 'List all roles with permissions' })
  getAllRoles() {
    return this.rbacService.getAllRoles();
  }

  @Post('roles')
  @RequirePermissions('ROLES:CONFIGURE')
  @ApiOperation({ summary: 'Create a new role' })
  createRole(@Body() data: { name: string; displayName: string; description?: string }) {
    return this.rbacService.createRole(data);
  }

  @Post('roles/:roleId/permissions')
  @RequirePermissions('ROLES:CONFIGURE')
  @ApiOperation({ summary: 'Set permissions for a role' })
  setRolePermissions(
    @Param('roleId') roleId: string,
    @Body() data: { permissionIds: string[] },
  ) {
    return this.rbacService.setRolePermissions(roleId, data.permissionIds);
  }

  @Get('permissions')
  @RequirePermissions('ROLES:READ')
  @ApiOperation({ summary: 'List all available permissions' })
  getAllPermissions() {
    return this.rbacService.getAllPermissions();
  }
}
