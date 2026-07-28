import { IsString, IsArray, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SegmentRuleDto {
  @ApiProperty({ example: 'tag' })
  @IsString()
  field: string;

  @ApiProperty({ example: 'equals' })
  @IsString()
  operator: string;

  @ApiProperty({ example: 'vip' })
  @IsString()
  value: string;
}

export class CreateSegmentDto {
  @ApiProperty({ example: 'VIP Clients' })
  @IsString()
  name: string;

  @ApiProperty({ type: [SegmentRuleDto] })
  @IsArray()
  rules: SegmentRuleDto[];
}

export class UpdateSegmentDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  rules?: SegmentRuleDto[];
}
