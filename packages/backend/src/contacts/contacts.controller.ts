import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ContactsService } from './contacts.service';
import { CreateContactDto, UpdateContactDto, ImportContactsDto } from './dto/contacts.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Contacts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('contacts')
export class ContactsController {
  constructor(private contactsService: ContactsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar contato' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateContactDto) {
    return this.contactsService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar contatos' })
  findAll(
    @CurrentUser('id') userId: string,
    @Query('search') search?: string,
    @Query('tag') tag?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.contactsService.findAll(userId, { search, tag, page, limit });
  }

  @Get('tags')
  @ApiOperation({ summary: 'Listar tags únicas' })
  getTags(@CurrentUser('id') userId: string) {
    return this.contactsService.getTags(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter contato por ID' })
  findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.contactsService.findOne(userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar contato' })
  update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateContactDto,
  ) {
    return this.contactsService.update(userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir contato' })
  remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.contactsService.remove(userId, id);
  }

  @Post('import')
  @ApiOperation({ summary: 'Importar contatos em lote' })
  import(@CurrentUser('id') userId: string, @Body() dto: ImportContactsDto) {
    return this.contactsService.import(userId, dto);
  }
}
