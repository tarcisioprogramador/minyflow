import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BroadcastsService } from './broadcasts.service';
import { CreateBroadcastDto, UpdateBroadcastDto } from './dto/broadcasts.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Broadcasts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('broadcasts')
export class BroadcastsController {
  constructor(private broadcastsService: BroadcastsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar broadcast' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateBroadcastDto) {
    return this.broadcastsService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar broadcasts' })
  findAll(@CurrentUser('id') userId: string) {
    return this.broadcastsService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter broadcast' })
  findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.broadcastsService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar broadcast' })
  update(@Param('id') id: string, @CurrentUser('id') userId: string, @Body() dto: UpdateBroadcastDto) {
    return this.broadcastsService.update(id, userId, dto);
  }

  @Post(':id/send')
  @ApiOperation({ summary: 'Enviar broadcast' })
  send(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.broadcastsService.send(id, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir broadcast' })
  remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.broadcastsService.remove(id, userId);
  }
}
