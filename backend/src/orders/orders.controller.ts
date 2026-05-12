import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import type { OrderStatus, User } from '@prisma/client';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Place an order (checkout)' })
  checkout(@CurrentUser() user: User, @Body() dto: CreateOrderDto) {
    return this.ordersService.checkout(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List orders (own for customers, all for admin)' })
  findAll(@CurrentUser() user: User, @Query() pagination: PaginationDto) {
    return this.ordersService.findAll(user, pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order detail' })
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.ordersService.findOne(id, user);
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update order status (admin only)' })
  updateStatus(@Param('id') id: string, @Body('status') status: OrderStatus) {
    return this.ordersService.updateStatus(id, status);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel order (customer, PENDING or CONFIRMED only)' })
  cancel(@Param('id') id: string, @CurrentUser() user: User) {
    return this.ordersService.cancel(id, user.id);
  }
}
