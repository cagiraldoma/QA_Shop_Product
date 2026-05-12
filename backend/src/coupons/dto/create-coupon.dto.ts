import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';
import { DiscountType } from '@prisma/client';

export class CreateCouponDto {
  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ enum: DiscountType })
  @IsEnum(DiscountType)
  discountType: DiscountType;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  discountValue: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minimumAmount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  maximumDiscount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  usageLimit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expiresAt?: Date;
}
