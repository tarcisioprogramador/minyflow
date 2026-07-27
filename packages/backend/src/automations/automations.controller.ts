import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AutomationsService } from './automations.service';
import { CreateAutomationDto, UpdateAutomationDto } from './dto/automations.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Automations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('automations')
export class AutomationsController {
  constructor(private automationsService: AutomationsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar automação' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateAutomationDto) {
    return this.automationsService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar automações' })
  findAll(@CurrentUser('id') userId: string) {
    return this.automationsService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter automação' })
  findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.automationsService.findOne(userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar automação' })
  update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAutomationDto,
  ) {
    return this.automationsService.update(userId, id, dto);
  }

  @Patch(':id/toggle')
  @ApiOperation({ summary: 'Ativar/desativar automação' })
  toggle(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.automationsService.toggle(userId, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir automação' })
  remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.automationsService.remove(userId, id);
  }
}
