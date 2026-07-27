import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { SendMessageDto } from './dto/messages.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Messages')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Post()
  @ApiOperation({ summary: 'Enviar mensagem' })
  send(@CurrentUser('id') userId: string, @Body() dto: SendMessageDto) {
    return this.messagesService.send(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar mensagens' })
  findAll(
    @CurrentUser('id') userId: string,
    @Query('contactId') contactId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.messagesService.findAll(userId, { contactId, page, limit });
  }
}
