import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SegmentsService } from './segments.service';
import { CreateSegmentDto, UpdateSegmentDto } from './dto/segments.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Segments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('segments')
export class SegmentsController {
  constructor(private segmentsService: SegmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar segmento' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateSegmentDto) {
    return this.segmentsService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar segmentos' })
  findAll(@CurrentUser('id') userId: string) {
    return this.segmentsService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter segmento' })
  findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.segmentsService.findOne(id, userId);
  }

  @Get(':id/contacts')
  @ApiOperation({ summary: 'Contatos do segmento' })
  getContacts(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.segmentsService.getContacts(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar segmento' })
  update(@Param('id') id: string, @CurrentUser('id') userId: string, @Body() dto: UpdateSegmentDto) {
    return this.segmentsService.update(id, userId, dto);
  }

  @Post(':id/refresh')
  @ApiOperation({ summary: 'Recalcular contatos do segmento' })
  refresh(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.segmentsService.refresh(id, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir segmento' })
  remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.segmentsService.remove(id, userId);
  }
}
