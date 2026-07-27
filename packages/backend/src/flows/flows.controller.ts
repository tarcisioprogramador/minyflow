import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FlowsService } from './flows.service';
import { CreateFlowDto, UpdateFlowDto } from './dto/flows.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Flows')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('flows')
export class FlowsController {
  constructor(private flowsService: FlowsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo fluxo' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateFlowDto) {
    return this.flowsService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os fluxos' })
  findAll(@CurrentUser('id') userId: string) {
    return this.flowsService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter fluxo por ID' })
  findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.flowsService.findOne(userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar fluxo' })
  update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateFlowDto,
  ) {
    return this.flowsService.update(userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir fluxo' })
  remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.flowsService.remove(userId, id);
  }

  @Post(':id/duplicate')
  @ApiOperation({ summary: 'Duplicar fluxo' })
  duplicate(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.flowsService.duplicate(userId, id);
  }

  @Patch(':id/toggle')
  @ApiOperation({ summary: 'Ativar/desativar fluxo' })
  toggle(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.flowsService.toggleStatus(userId, id);
  }
}
