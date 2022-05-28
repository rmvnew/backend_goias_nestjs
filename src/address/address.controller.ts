import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';

@Controller('address')
@ApiTags('Address')
export class AddressController {
  constructor(private readonly addressService: AddressService) { }

  @Post()
  async create(
    @Body() createAddressDto: CreateAddressDto
  ): Promise<Address> {
    return this.addressService.create(createAddressDto);
  }

  @Get()
  async findAll() {
    return this.addressService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string
  ): Promise<Address> {
    return this.addressService.findById(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto
  ): Promise<Address> {
    return this.addressService.update(+id, updateAddressDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.addressService.remove(+id);
  }
}
