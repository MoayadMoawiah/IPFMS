import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Search')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('search')
export class SearchController {
  constructor(private readonly svc: SearchService) {}

  @Get()
  search(@Query('q') query: string, @Query('limit') limit?: string) {
    return this.svc.globalSearch(query, limit ? parseInt(limit) : 20);
  }
}
