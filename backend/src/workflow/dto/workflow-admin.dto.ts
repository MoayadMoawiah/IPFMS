import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class AdminMoveDto {
  @IsIn(['FORWARD', 'BACK'])
  direction!: 'FORWARD' | 'BACK';

  @IsString()
  @MinLength(5)
  comment!: string;
}

export class AdminSetStepDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  stepNumber!: number;

  @IsString()
  @MinLength(5)
  comment!: string;
}

export class AdminCommentDto {
  @IsString()
  @MinLength(5)
  comment!: string;
}

export class AdminReopenDto {
  @IsString()
  @IsNotEmpty()
  documentType!: string;

  @IsString()
  @IsNotEmpty()
  documentId!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  stepNumber?: number;

  @IsString()
  @MinLength(5)
  comment!: string;
}
