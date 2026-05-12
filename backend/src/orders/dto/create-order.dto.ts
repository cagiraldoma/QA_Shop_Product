import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ description: 'Shipping address ID' })
  @IsString()
  addressId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  couponCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
