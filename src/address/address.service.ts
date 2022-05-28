import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';

@Injectable()
export class AddressService {

  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>
  ) { }

  async create(createAddressDto: CreateAddressDto): Promise<Address> {

    const address = this.addressRepository.create(createAddressDto)

    address.isActive = true

    return this.addressRepository.save(address)
  }

  async findAll() {
    return this.addressRepository.find()
  }

  async findById(id: number): Promise<Address> {
    return this.addressRepository.findOne({
      where: {
        address_id: id
      }
    })
  }

  async update(id: number, updateAddressDto: UpdateAddressDto): Promise<Address> {

    const isRegistered = await this.findById(id)

    if (!isRegistered) {
      throw new NotFoundException(`O Endereço com id: ${id} não foi encontrado!!`)
    }

    const addressSaved = await this.addressRepository.preload({
      address_id: id,
      ...updateAddressDto
    })

    await this.addressRepository.save(addressSaved)

    return this.findById(id)
  }

  async remove(id: number) {

    const addressSaved = await this.findById(id)

    if (!addressSaved) {
      throw new NotFoundException(`O Endereço com id: ${id} não foi encontrado!!`)
    }

    addressSaved.isActive = false

    await this.addressRepository.save(addressSaved)

  }
}
