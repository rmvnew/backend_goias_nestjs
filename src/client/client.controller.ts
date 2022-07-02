import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';

@Controller('client')
@ApiTags('Client')
export class ClientController {
  constructor(private readonly clientService: ClientService) { }

  @Post()
  async create(
    @Body() createClientDto: CreateClientDto
  ): Promise<Client> {
    return this.clientService.create(createClientDto);
  }

  @Get()
  async findAll() {
    return this.clientService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id') id: number
  ): Promise<Client> {
    return this.clientService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto
  ): Promise<Client> {
    return this.clientService.update(+id, updateClientDto);
  }

  @Patch(':id')
  async changeStatusClient(
    @Param('id') id: number
    ): Promise<Client> {
    return this.clientService.changeStatusClient(id);
  }
}
