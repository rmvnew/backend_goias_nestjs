import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressService } from 'src/address/address.service';
import { CreateAddressDto } from 'src/address/dto/create-address.dto';
import { Exceptions } from 'src/common/enums';
import { ErrorMsg } from 'src/common/exception/message.exception';
import { CreatePersonDto } from 'src/person/dto/create-person.dto';
import { PersonService } from 'src/person/person.service';
import { Repository } from 'typeorm';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientService {

  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    private readonly personService: PersonService,
    private readonly addressService: AddressService
    
  ) { }

  async create(createClientDto: CreateClientDto): Promise<Client> {

    const {
      person: { person_cpf, person_email, person_name, person_rg, phone_numbers },
      address: { zipCode, address_number, city, country, district, state, street }
    } = createClientDto

    const client = this.clientRepository.create(createClientDto)


    const address: CreateAddressDto = {
      zipCode: zipCode,
      address_number: address_number,
      city: city,
      country: country,
      district: district,
      state: state,
      street: street
    }

    const person: CreatePersonDto = {
      address: await this.addressService.create(address),
      person_cpf: person_cpf,
      person_email: person_email,
      person_name: person_name,
      person_rg: person_rg,
      phone_numbers: phone_numbers
    }

    client.person = await this.personService.create(person)


    client.isActive = true

    return this.clientRepository.save(client)
  }

  async findAll() {
    return this.clientRepository.find()
  }

  async findById(id: number): Promise<Client> {
    return this.clientRepository.findOne({
      where: {
        client_id: id
      }
    })
  }

  async update(id: number, updateClientDto: UpdateClientDto) {

    const isRegistered = await this.findById(id)

    if (!isRegistered) {
      ErrorMsg.it().getErrMessage('client', `${id}`, Exceptions.NOT_FOUND)
    }

    const client = await this.clientRepository.preload({
      client_id: id,
      ...updateClientDto
    })


    await this.clientRepository.save(client)
    return this.findById(id)
  }

  async changeStatusClient(id: number) {

    const isRegistered = await this.findById(id)

    if (!isRegistered) {
      ErrorMsg.it().getErrMessage('client', `${id}`, Exceptions.NOT_FOUND)
    }

    const { isActive: status } = isRegistered

    isRegistered.isActive = status === true ? false : true

    await this.clientRepository.save(isRegistered)

    return this.findById(id)
  }
}
