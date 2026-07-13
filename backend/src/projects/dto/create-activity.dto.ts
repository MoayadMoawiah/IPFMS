import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsDecimal,
  IsNumber,
  Min,
  Max,
  Matches,
} from 'class-validator';

const POSITIVE_DECIMAL = /^(?:0*[1-9]\d*(?:\.\d{1,4})?|0+\.\d*[1-9]\d*)$/;

export class CreateActivityDto {
  @ApiPropertyOptional({ example: 'USAID-2026-001-ACT01' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ example: 'Beneficiary Registration' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Project ID (resolved from grantId if omitted)' })
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiPropertyOptional({ description: 'Grant ID — used to resolve the linked project' })
  @IsOptional()
  @IsString()
  grantId?: string;

  @ApiProperty({ example: '2026-01-15' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-03-31' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ example: '80000.0000' })
  @IsDecimal({ decimal_digits: '0,4' })
  @Matches(POSITIVE_DECIMAL, {
    message: 'plannedBudget must be a positive number',
  })
  plannedBudget: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  responsibleUserId?: string;
}

export class UpdateActivityDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDecimal({ decimal_digits: '0,4' })
  @Matches(POSITIVE_DECIMAL, {
    message: 'plannedBudget must be a positive number',
  })
  plannedBudget?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  responsibleUserId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;
}

export class UpdateActivityProgressDto {
  @ApiProperty({ example: 75 })
  @IsNumber()
  @Min(0)
  @Max(100)
  progressPercent: number;
}
