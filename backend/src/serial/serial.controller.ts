import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, Min } from 'class-validator';
import { SerialService } from './serial.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RbacGuard } from '../common/guards/rbac.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';

class NextSerialDto {
  @IsString()
  grantCode: string;

  @IsString()
  docType: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  padding?: number;
}

@ApiTags('Serial')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller('serial')
export class SerialController {
  constructor(private readonly serialService: SerialService) {}

  @Post('next')
  @RequirePermissions('SERIAL:CREATE')
  @ApiOperation({ summary: 'Generate next serial number (atomic)' })
  @ApiBody({ type: NextSerialDto })
  async next(@Body() dto: NextSerialDto) {
    const serialNumber = await this.serialService.next(dto.grantCode, dto.docType, dto.padding);
    return { data: { serialNumber } };
  }

  @Get('preview')
  @ApiOperation({ summary: 'Preview next serial number without incrementing' })
  async preview(
    @Query('grantCode') grantCode: string,
    @Query('docType') docType: string,
    @Query('padding') padding?: number,
  ) {
    const preview = await this.serialService.preview(grantCode, docType, padding);
    return { data: { preview } };
  }

  @Get('sequences')
  @RequirePermissions('SERIAL:READ')
  @ApiOperation({ summary: 'List all serial sequences' })
  getAllSequences() {
    return this.serialService.getAllSequences();
  }

  @Get('sequences/grant')
  @ApiOperation({ summary: 'Get sequences for a specific grant' })
  getGrantSequences(@Query('grantCode') grantCode: string) {
    return this.serialService.getGrantSequences(grantCode);
  }
}
