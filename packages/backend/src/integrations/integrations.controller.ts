import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IntegrationsService } from './integrations.service';
import { CreateIntegrationDto, UpdateIntegrationDto } from './dto/integrations.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Integrations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('integrations')
export class IntegrationsController {
  constructor(private integrationsService: IntegrationsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar integração' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateIntegrationDto) {
    return this.integrationsService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar integrações' })
  findAll(@CurrentUser('id') userId: string) {
    return this.integrationsService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter integração' })
  findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.integrationsService.findOne(userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar integração' })
  update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateIntegrationDto,
  ) {
    return this.integrationsService.update(userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir integração' })
  remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.integrationsService.remove(userId, id);
  }

  @Post(':id/test')
  @ApiOperation({ summary: 'Testar integração' })
  test(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.integrationsService.test(userId, id);
  }
}
