import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { User } from '@prisma/client';

@ApiTags('Addresses')
@ApiBearerAuth()
@Controller('addresses')
export class AddressesController {
  constructor(private addressesService: AddressesService) {}

  @Get()
  @ApiOperation({ summary: 'List current user addresses' })
  findAll(@CurrentUser() user: User) {
    return this.addressesService.findAll(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create address' })
  create(@CurrentUser() user: User, @Body() dto: CreateAddressDto) {
    return this.addressesService.create(user.id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update address' })
  update(@Param('id') id: string, @CurrentUser() user: User, @Body() dto: Partial<CreateAddressDto>) {
    return this.addressesService.update(id, user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete address' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.addressesService.remove(id, user.id);
  }

  @Patch(':id/default')
  @ApiOperation({ summary: 'Set address as default' })
  setDefault(@Param('id') id: string, @CurrentUser() user: User) {
    return this.addressesService.setDefault(id, user.id);
  }
}
