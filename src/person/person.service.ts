import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from 'src/address/entities/address.entity';
import { Exceptions } from 'src/common/enums';
import { ErrorMsg } from 'src/common/exception/message.exception';
import { CreatePhoneDto } from 'src/phone/dto/create-phone.dto';
import { PhoneService } from 'src/phone/phone.service';
import { Repository } from 'typeorm';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Person } from './entities/person.entity';

@Injectable()
export class PersonService {

  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    private readonly phoneService: PhoneService
  ) { }

  async create(createPersonDto: CreatePersonDto): Promise<Person> {

    const { person_name, phone_numbers, address } = createPersonDto

    const person = this.personRepository.create(createPersonDto)

    person.person_name = person_name.toUpperCase()

    const isRegistered = await this.findByName(person.person_name)

    if (isRegistered) {
      ErrorMsg.it().getErrMessage('person', person.person_name, Exceptions.ALREADY_EXISTS)
    }


    person.address = address

    person.isActive = true

    const personSaved = await this.personRepository.save(person)

    if (phone_numbers) {

      for (let element of phone_numbers) {
        const phoneDto: CreatePhoneDto = {
          phone_number: element,
          person: personSaved
        }

        await this.phoneService.create(phoneDto)

      }
    }

    return personSaved
  }

  async findByName(person_name: string): Promise<Person> {
    return this.personRepository.findOne({
      where: {
        person_name
      }
    })
  }

  async findAll() {
    return this.personRepository.find()
  }

  async findById(id: number): Promise<Person> {
    return this.personRepository.findOne({
      where: {
        person_id: id
      }
    })
  }

  async update(id: number, updatePersonDto: UpdatePersonDto): Promise<Person> {

    const isPersonRegistered = await this.findById(id)

    if (!isPersonRegistered) {
      ErrorMsg.it().getErrMessage('person', `${id}`, Exceptions.NOT_FOUND)
    }

    const personSaved = await this.personRepository.preload({
      person_id: id,
      ...updatePersonDto
    })


    await this.personRepository.save(personSaved)

    return this.findById(id)
  }

  async changeStatusPerson(id: number) {

    const isPersonRegistered = await this.findById(id)

    const { isActive: status } = isPersonRegistered

    if (!isPersonRegistered) {
      ErrorMsg.it().getErrMessage('person', `${id}`, Exceptions.NOT_FOUND)
    }

    isPersonRegistered.isActive = status === true ? false : true

    await this.personRepository.save(isPersonRegistered)

    return this.findById(id)
  }
}
