import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { AddressType } from '@prisma/client';

export class CreateAddressDto {
  @ApiPropertyOptional({ enum: AddressType, default: AddressType.SHIPPING })
  @IsOptional()
  @IsEnum(AddressType)
  type?: AddressType;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  firstName: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  lastName: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  street: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  street2?: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  city: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  state: string;

  @ApiProperty()
  @IsString()
  @MinLength(4)
  @MaxLength(10)
  zipCode: string;

  @ApiPropertyOptional({ default: 'US' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional()
  @IsOptional()
  isDefault?: boolean;
}
