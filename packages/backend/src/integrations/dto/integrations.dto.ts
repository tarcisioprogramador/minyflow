import { IsString, IsObject, IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateIntegrationDto {
  @ApiProperty({ enum: ['WHATSAPP', 'SMS', 'EMAIL'] })
  @IsEnum(['WHATSAPP', 'SMS', 'EMAIL'])
  type: string;

  @ApiProperty({ example: 'WhatsApp Business' })
  @IsString()
  name: string;

  @ApiProperty({
    example: {
      phoneNumberId: '123456',
      accessToken: 'xxx',
      webhookVerifyToken: 'yyy',
    },
  })
  @IsObject()
  config: Record<string, any>;
}

export class UpdateIntegrationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsObject()
  config?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
