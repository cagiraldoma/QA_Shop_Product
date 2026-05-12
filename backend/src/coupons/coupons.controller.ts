import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Coupons')
@ApiBearerAuth()
@Roles(Role.ADMIN)
@Controller('coupons')
export class CouponsController {
  constructor(private couponsService: CouponsService) {}

  @Get()
  @ApiOperation({ summary: 'List all coupons (admin only)' })
  findAll(@Query() pagination: PaginationDto) {
    return this.couponsService.findAll(pagination);
  }

  @Post()
  @ApiOperation({ summary: 'Create coupon (admin only)' })
  create(@Body() dto: CreateCouponDto) {
    return this.couponsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update coupon (admin only)' })
  update(@Param('id') id: string, @Body() dto: Partial<CreateCouponDto>) {
    return this.couponsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete coupon (admin only)' })
  remove(@Param('id') id: string) {
    return this.couponsService.remove(id);
  }
}
