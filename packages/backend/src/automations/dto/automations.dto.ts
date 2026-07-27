import { IsString, IsObject, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAutomationDto {
  @ApiProperty({ example: 'Saudação automática' })
  @IsString()
  name: string;

  @ApiProperty({
    example: {
      type: 'KEYWORD',
      keyword: 'oi',
      matchType: 'contains',
    },
  })
  @IsObject()
  trigger: Record<string, any>;

  @ApiProperty()
  @IsString()
  flowId: string;
}

export class UpdateAutomationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsObject()
  trigger?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  flowId?: string;
}
