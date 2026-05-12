import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { User } from '@prisma/client';

@ApiTags('Cart')
@ApiBearerAuth()
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user cart' })
  getCart(@CurrentUser() user: User) {
    return this.cartService.getCart(user.id);
  }

  @Post('items')
  @ApiOperation({ summary: 'Add item to cart' })
  addItem(@CurrentUser() user: User, @Body() dto: AddToCartDto) {
    return this.cartService.addItem(user.id, dto);
  }

  @Patch('items/:itemId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  updateItem(
    @CurrentUser() user: User,
    @Param('itemId') itemId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.cartService.updateItem(user.id, itemId, quantity);
  }

  @Delete('items/:itemId')
  @ApiOperation({ summary: 'Remove item from cart' })
  removeItem(@CurrentUser() user: User, @Param('itemId') itemId: string) {
    return this.cartService.removeItem(user.id, itemId);
  }

  @Delete()
  @ApiOperation({ summary: 'Clear entire cart' })
  clearCart(@CurrentUser() user: User) {
    return this.cartService.clearCart(user.id);
  }

  @Post('validate-coupon')
  @ApiOperation({ summary: 'Validate a coupon code' })
  validateCoupon(@Body('code') code: string, @Body('subtotal') subtotal: number) {
    return this.cartService.validateCoupon(code, subtotal);
  }
}
