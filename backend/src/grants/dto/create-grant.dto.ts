import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsDecimal,
  IsInt,
  Min,
  Matches,
} from 'class-validator';

export class CreateGrantDto {
  @ApiProperty({ example: 'USAID-2026' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'Health Systems Strengthening Project' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Donor ID' })
  @IsString()
  @IsNotEmpty()
  donorId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fiscalYearId?: string;

  @ApiProperty({ example: 'USD', default: 'USD' })
  @IsString()
  currency: string = 'USD';

  @ApiProperty({ example: '500000.0000', description: 'Total budget in grant currency' })
  @IsDecimal({ decimal_digits: '0,4' })
  @Matches(/^(?:0*[1-9]\d*(?:\.\d{1,4})?|0+\.\d*[1-9]\d*)$/, {
    message: 'totalBudget must be a positive number',
  })
  totalBudget: string;

  @ApiProperty({ example: '2026-01-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-12-31' })
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  signedDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  objectives?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  conditions?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reportingRequirements?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  targetBeneficiaries?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  grantManagerId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  projectCoordinatorId?: string;
}