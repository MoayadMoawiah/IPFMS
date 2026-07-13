import {
  Controller,
  Post,
  Get,
  Body,
  Put,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, UserPayload } from '../common/decorators/current-user.decorator';

class ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  async login(@Body() dto: LoginDto, @Req() req: Request) {
    const ipAddress = req.ip || req.connection.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';
    return this.authService.login(dto, ipAddress, userAgent);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout and invalidate refresh token' })
  async logout(@CurrentUser() user: UserPayload) {
    return this.authService.logout(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async getMe(@CurrentUser() user: UserPayload) {
    return this.authService.getMe(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me/password')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change password' })
  async changePassword(@CurrentUser() user: UserPayload, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(user.id, dto.currentPassword, dto.newPassword);
  }
}
