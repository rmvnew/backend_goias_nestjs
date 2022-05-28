import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePhoneDto } from './dto/create-phone.dto';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { Phone } from './entities/phone.entity';

@Injectable()
export class PhoneService {

  constructor(
    @InjectRepository(Phone)
    private readonly phoneRepository: Repository<Phone>
  ) { }

  async create(createPhoneDto: CreatePhoneDto): Promise<Phone> {

    const phone = this.phoneRepository.create(createPhoneDto)

    phone.isActive = true

    return this.phoneRepository.save(phone)
  }

  async findAll() {
    return this.phoneRepository.find()
  }

  async findById(id: number): Promise<Phone> {
    return this.phoneRepository.findOne({
      where: {
        phone_id: id,
        isActive: true
      }
    })
  }

  async update(id: number, updatePhoneDto: UpdatePhoneDto): Promise<Phone> {


    const isRegistered = await this.findById(id)

    if (!isRegistered) {
      throw new NotFoundException(`O Telefone com id: ${id}, não foi encontrado!`)
    }

    const phone = await this.phoneRepository.preload({
      phone_id: id,
      ...updatePhoneDto
    })

    await this.phoneRepository.save(phone)
    return this.findById(id)
  }

  async remove(id: number) {

    const phoneSaved = await this.findById(id)

    if (!phoneSaved) {
      throw new NotFoundException(`O Telefone com id: ${id}, não foi encontrado!`)
    }

    phoneSaved.isActive = false

    await this.phoneRepository.save(phoneSaved)


  }
}
