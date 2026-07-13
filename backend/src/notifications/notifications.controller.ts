import { Controller, Get, Post, Delete, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, UserPayload } from '../common/decorators/current-user.decorator';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly svc: NotificationsService) {}

  @Get() findAll(@CurrentUser() user: UserPayload, @Query() q: any) { return this.svc.findForUser(user.id, q); }
  @Get('unread-count') getCount(@CurrentUser() user: UserPayload) { return this.svc.getUnreadCount(user.id); }
  @Post(':id/read') markRead(@Param('id') id: string, @CurrentUser() user: UserPayload) { return this.svc.markRead(id, user.id); }
  @Post('read-all') markAllRead(@CurrentUser() user: UserPayload) { return this.svc.markAllRead(user.id); }
}
