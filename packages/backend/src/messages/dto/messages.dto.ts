import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiProperty()
  @IsString()
  contactId: string;

  @ApiProperty({ example: 'Olá! Seja bem-vindo ao Minyflow!' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ enum: ['WHATSAPP', 'SMS', 'EMAIL'] })
  @IsOptional()
  @IsEnum(['WHATSAPP', 'SMS', 'EMAIL'])
  channel?: string;
}
