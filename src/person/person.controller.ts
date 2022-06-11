import { Controller, Get, Post, Body, Patch, Param, Put } from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Person } from './entities/person.entity';

@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) { }

  @Post()
  async create(
    @Body() createPersonDto: CreatePersonDto
  ): Promise<Person> {
    return this.personService.create(createPersonDto);
  }

  @Get()
  async findAll() {
    return this.personService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string
  ): Promise<Person> {
    return this.personService.findById(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePersonDto: UpdatePersonDto
  ): Promise<Person> {
    return this.personService.update(+id, updatePersonDto);
  }

  @Patch(':id')
  changeStatusPerson(
    @Param('id') id: string
  ): Promise<Person> {
    return this.personService.changeStatusPerson(+id);
  }
}
