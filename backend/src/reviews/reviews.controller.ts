import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto, UpdateReviewDto } from './dto/create-review.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import type { User } from '@prisma/client';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get reviews for a product' })
  getProductReviews(@Query('productId') productId: string) {
    return this.reviewsService.getProductReviews(productId);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit a review (must have purchased product)' })
  create(@CurrentUser() user: User, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(user, dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Edit own review' })
  update(@Param('id') id: string, @CurrentUser() user: User, @Body() dto: UpdateReviewDto) {
    return this.reviewsService.update(id, user, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete review (own or admin)' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.reviewsService.remove(id, user);
  }
}
