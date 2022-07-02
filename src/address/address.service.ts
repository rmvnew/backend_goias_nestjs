import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Exceptions, ValidType } from 'src/common/enums';
import { ErrorMsg } from 'src/common/exception/message.exception';
import { Validations } from 'src/common/utils/validations';
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

    const { address_number, city, country, district, state, street, zipCode } = createAddressDto

    const address = this.addressRepository.create(createAddressDto)

    Validations.getInstance().validateWithRegex(
      address_number,
      ValidType.NO_SPACE,
      ValidType.NO_SPECIAL_CHARACTER)
    address.address_number = address_number.toUpperCase()

    Validations.getInstance().validateWithRegex(
      city,
      ValidType.NO_MANY_SPACE,
      ValidType.NO_SPECIAL_CHARACTER)
    address.city = city.toUpperCase()

    Validations.getInstance().validateWithRegex(
      country,
      ValidType.NO_MANY_SPACE,
      ValidType.NO_SPECIAL_CHARACTER)
    address.country = country.toUpperCase()

    Validations.getInstance().validateWithRegex(
      district,
      ValidType.NO_MANY_SPACE,
      ValidType.NO_SPECIAL_CHARACTER)
    address.district = district.toUpperCase()

    Validations.getInstance().validateWithRegex(
      state,
      ValidType.NO_MANY_SPACE,
      ValidType.NO_SPECIAL_CHARACTER)
    address.state = state.toUpperCase()

    Validations.getInstance().validateWithRegex(
      street,
      ValidType.NO_MANY_SPACE,
      ValidType.NO_SPECIAL_CHARACTER)
    address.street = street.toUpperCase()

    Validations.getInstance().validateWithRegex(
      zipCode,
      ValidType.NO_SPACE,
      ValidType.NO_SPECIAL_CHARACTER,
      ValidType.IS_NUMBER)
    address.zipCode = zipCode.toUpperCase()

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

    const { address_number, city, country, district, state, street, zipCode } = updateAddressDto

    const isRegistered = await this.findById(id)

    if (!isRegistered) {
      ErrorMsg.it().getErrMessage('address', `${id}`, Exceptions.NOT_FOUND)
    }

    const address = await this.addressRepository.preload({
      address_id: id,
      ...updateAddressDto
    })

    if (address_number) {
      Validations.getInstance().validateWithRegex(
        address_number,
        ValidType.NO_MANY_SPACE,
        ValidType.NO_SPECIAL_CHARACTER)
      address.address_number = address_number.toUpperCase()
    }

    if (city) {
      Validations.getInstance().validateWithRegex(
        city,
        ValidType.NO_MANY_SPACE,
        ValidType.NO_SPECIAL_CHARACTER)
      address.city = city.toUpperCase()
    }

    if (country) {
      Validations.getInstance().validateWithRegex(
        country,
        ValidType.NO_MANY_SPACE,
        ValidType.NO_SPECIAL_CHARACTER)
      address.country = country.toUpperCase()
    }

    if (district) {
      Validations.getInstance().validateWithRegex(
        district,
        ValidType.NO_MANY_SPACE,
        ValidType.NO_SPECIAL_CHARACTER)
      address.district = district.toUpperCase()
    }

    if (state) {
      Validations.getInstance().validateWithRegex(
        state,
        ValidType.NO_MANY_SPACE,
        ValidType.NO_SPECIAL_CHARACTER)
      address.state = state.toUpperCase()
    }

    if (street) {
      Validations.getInstance().validateWithRegex(
        street,
        ValidType.NO_MANY_SPACE,
        ValidType.NO_SPECIAL_CHARACTER)
      address.street = street.toUpperCase()
    }

    if (zipCode) {
      Validations.getInstance().validateWithRegex(
        zipCode,
        ValidType.NO_SPACE,
        ValidType.NO_SPECIAL_CHARACTER)
      address.zipCode = zipCode.toUpperCase()
    }

    await this.addressRepository.save(address)

    return this.findById(id)
  }

  async remove(id: number) {

    const addressSaved = await this.findById(id)

    if (!addressSaved) {
      ErrorMsg.it().getErrMessage('address', `${id}`, Exceptions.NOT_FOUND)
    }

    addressSaved.isActive = false

    await this.addressRepository.save(addressSaved)

  }
}
