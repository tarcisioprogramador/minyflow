import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Dashboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Obter estatísticas do dashboard' })
  getStats(@CurrentUser('id') userId: string) {
    return this.dashboardService.getStats(userId);
  }

  @Get('chart')
  @ApiOperation({ summary: 'Obter dados do gráfico' })
  getChart(
    @CurrentUser('id') userId: string,
    @Query('days') days?: number,
  ) {
    return this.dashboardService.getChartData(userId, days);
  }
}
