import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DripSequencesService } from './drip-sequences.service';
import { CreateDripSequenceDto, UpdateDripSequenceDto, EnrollContactDto } from './dto/drip-sequences.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('DripSequences')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('drip-sequences')
export class DripSequencesController {
  constructor(private dripService: DripSequencesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar sequencia drip' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateDripSequenceDto) {
    return this.dripService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar sequencias drip' })
  findAll(@CurrentUser('id') userId: string) {
    return this.dripService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter sequencia drip' })
  findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.dripService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar sequencia drip' })
  update(@Param('id') id: string, @CurrentUser('id') userId: string, @Body() dto: UpdateDripSequenceDto) {
    return this.dripService.update(id, userId, dto);
  }

  @Post(':id/enroll')
  @ApiOperation({ summary: 'Inscrever contato na sequencia' })
  enroll(@Param('id') id: string, @CurrentUser('id') userId: string, @Body() dto: EnrollContactDto) {
    return this.dripService.enroll(userId, id, dto.contactId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir sequencia drip' })
  remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.dripService.remove(id, userId);
  }
}
