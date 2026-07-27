import { IsString, IsOptional, IsEnum, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFlowDto {
  @ApiProperty({ example: 'Boas-vindas' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Fluxo de boas-vindas para novos leads' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateFlowDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['DRAFT', 'ACTIVE', 'PAUSED'])
  status?: string;

  @IsOptional()
  @IsObject()
  nodes?: any[];

  @IsOptional()
  @IsObject()
  edges?: any[];
}

export class FlowNodeDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty({ enum: ['TRIGGER', 'MESSAGE', 'CONDITION', 'ACTION', 'WAIT', 'END'] })
  @IsEnum(['TRIGGER', 'MESSAGE', 'CONDITION', 'ACTION', 'WAIT', 'END'])
  type: string;

  @ApiProperty()
  @IsObject()
  position: { x: number; y: number };

  @ApiProperty()
  @IsObject()
  data: Record<string, any>;
}

export class FlowEdgeDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  source: string;

  @ApiProperty()
  @IsString()
  target: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  label?: string;
}
