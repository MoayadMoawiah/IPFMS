import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RbacGuard } from '../common/guards/rbac.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { CurrentUser, UserPayload } from '../common/decorators/current-user.decorator';

@ApiTags('Inventory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly svc: InventoryService) {}

  @Get('items') @RequirePermissions('INVENTORY:READ') findAll(@Query() q: any) { return this.svc.findAllItems(q); }
  @Post('items') @RequirePermissions('INVENTORY:CREATE') create(@Body() dto: any) { return this.svc.createItem(dto); }
  @Get('items/low-stock') @RequirePermissions('INVENTORY:READ') lowStock() { return this.svc.getLowStock(); }
  @Get('items/:id') @RequirePermissions('INVENTORY:READ') findOne(@Param('id') id: string) { return this.svc.findOneItem(id); }
  @Get('items/:id/movements') @RequirePermissions('INVENTORY:READ') movements(@Param('id') id: string, @Query() q: any) { return this.svc.getMovements(id, q); }
  @Post('items/:id/issue') @RequirePermissions('INVENTORY:UPDATE') issue(@Param('id') id: string, @Body() dto: any, @CurrentUser() user: UserPayload) { return this.svc.issue(id, dto, user.id); }
  @Get('warehouses') @RequirePermissions('INVENTORY:READ') warehouses(@Query() q: any) { return this.svc.findWarehouses(q); }
  @Post('warehouses') @RequirePermissions('INVENTORY:CREATE') createWarehouse(@Body() dto: any) { return this.svc.createWarehouse(dto); }
  @Get('warehouses/:id/stock') @RequirePermissions('INVENTORY:READ') warehouseStock(@Param('id') id: string) { return this.svc.getWarehouseStock(id); }
}
