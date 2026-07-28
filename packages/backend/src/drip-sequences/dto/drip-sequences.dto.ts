import { IsString, IsOptional, IsArray, IsBoolean, ValidateNested, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class DripStepDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  order: number;

  @ApiProperty({ example: 'Ola! Bem vindo a nossa plataforma.' })
  @IsString()
  content: string;

  @ApiProperty({ example: 'WHATSAPP' })
  @IsOptional()
  @IsString()
  channel?: string;

  @ApiProperty({ example: 60 })
  @IsNumber()
  delayMinutes: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  condition?: string;
}

export class CreateDripSequenceDto {
  @ApiProperty({ example: 'Onboarding Sequencial' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Sequencia de boas-vindas para novos contatos' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ type: [DripStepDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DripStepDto)
  steps: DripStepDto[];
}

export class UpdateDripSequenceDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DripStepDto)
  steps?: DripStepDto[];
}

export class EnrollContactDto {
  @ApiProperty()
  @IsString()
  contactId: string;
}
