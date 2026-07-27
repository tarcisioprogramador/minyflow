import { Controller, Get, Post, Query, Body, Req, Res } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';

@ApiTags('Webhook')
@Controller('webhook')
export class WebhookController {

  @Get('whatsapp')
  @ApiOperation({ summary: 'Verificação de webhook WhatsApp' })
  verifyWhatsApp(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
    @Res() res: Response,
  ) {
    if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }
    return res.status(403).send('Forbidden');
  }

  @Post('whatsapp')
  @ApiOperation({ summary: 'Receber mensagens WhatsApp' })
  async receiveWhatsApp(@Body() body: any, @Req() req: Request) {
    console.log('WhatsApp webhook received:', JSON.stringify(body, null, 2));
    return { status: 'ok' };
  }
}
