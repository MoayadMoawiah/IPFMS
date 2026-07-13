import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RbacGuard } from '../common/guards/rbac.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { CurrentUser, UserPayload } from '../common/decorators/current-user.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly svc: UsersService) {}

  @Get() @RequirePermissions('USERS:READ') findAll(@Query() q: any) { return this.svc.findAll(q); }
  @Post() @RequirePermissions('USERS:CREATE') create(@Body() dto: any) { return this.svc.create(dto); }
  @Get(':id') @RequirePermissions('USERS:READ') findOne(@Param('id') id: string) { return this.svc.findOne(id); }
  @Patch(':id') @RequirePermissions('USERS:UPDATE') update(@Param('id') id: string, @Body() dto: UpdateUserDto) { return this.svc.update(id, dto); }
  @Delete(':id') @RequirePermissions('USERS:DELETE') @HttpCode(HttpStatus.NO_CONTENT) remove(@Param('id') id: string, @CurrentUser() user: UserPayload) { return this.svc.softDelete(id, user.id); }
  @Post(':id/activate') @RequirePermissions('USERS:UPDATE') activate(@Param('id') id: string) { return this.svc.activate(id); }
  @Post(':id/deactivate') @RequirePermissions('USERS:UPDATE') deactivate(@Param('id') id: string) { return this.svc.deactivate(id); }
  @Get(':id/permissions') @RequirePermissions('USERS:READ') getPermissions(@Param('id') id: string) { return this.svc.getUserPermissions(id); }
  @Post(':id/roles') @RequirePermissions('ROLES:CONFIGURE') assignRole(@Param('id') id: string, @Body() body: { roleId: string }, @CurrentUser() user: UserPayload) { return this.svc.assignRole(id, body.roleId, user.id); }
  @Delete(':id/roles/:roleId') @RequirePermissions('ROLES:CONFIGURE') removeRole(@Param('id') id: string, @Param('roleId') roleId: string) { return this.svc.removeRole(id, roleId); }
}
