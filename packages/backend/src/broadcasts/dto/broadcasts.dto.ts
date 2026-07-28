import { IsString, IsOptional, IsArray, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBroadcastDto {
  @ApiProperty({ example: 'Promo de Verao' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Confira nossas ofertas imperdiveis!' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ example: 'WHATSAPP' })
  @IsOptional()
  @IsString()
  channel?: string;

  @ApiPropertyOptional({ example: ['clientes', 'vip'] })
  @IsOptional()
  @IsArray()
  targetTags?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;
}

export class UpdateBroadcastDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  targetTags?: string[];

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;
}
