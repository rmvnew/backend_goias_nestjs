import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { PhoneService } from './phone.service';
import { CreatePhoneDto } from './dto/create-phone.dto';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { ApiTags } from '@nestjs/swagger';
import { Phone } from './entities/phone.entity';

@Controller('phone')
@ApiTags('Phone')
export class PhoneController {
  constructor(private readonly phoneService: PhoneService) { }

  @Post()
  async create(
    @Body() createPhoneDto: CreatePhoneDto
  ): Promise<Phone> {
    return this.phoneService.create(createPhoneDto);
  }

  @Get()
  async findAll(): Promise<Phone[]> {
    return this.phoneService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string
  ): Promise<Phone> {
    return this.phoneService.findById(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePhoneDto: UpdatePhoneDto
  ): Promise<Phone> {
    return this.phoneService.update(+id, updatePhoneDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.phoneService.remove(+id);
  }
}
