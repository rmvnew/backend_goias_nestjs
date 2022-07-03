import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { AddressService } from 'src/address/address.service';
import { CreateAddressDto } from 'src/address/dto/create-address.dto';
import { SortingType } from 'src/common/enums';
import { hash } from 'src/common/utils/hash';
import { CreatePersonDto } from 'src/person/dto/create-person.dto';
import { PersonService } from 'src/person/person.service';
import { FilterUser } from 'src/profile/dto/filter.user';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {



  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly personService: PersonService,
    private readonly addressService: AddressService
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {

    const {
      person: { person_cpf, person_email, person_name, person_rg, phone_numbers },
      address: { zipCode, address_number, city, country, district, state, street },
      user_password: password
    } = createUserDto

    const user = this.userRepository.create(createUserDto)

    const isRegistered = await this.personService.findByCpf(person_cpf)

    if (isRegistered) {
      throw new BadRequestException(`O cpf ${person_cpf} já está cadastrado!`)
    }

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

    user.person = await this.personService.create(person)

    user.user_password = await hash(password)

    user.isActive = true

    user.first_access = true


    return this.userRepository.save(user)

  }

  async findAll(filter: FilterUser): Promise<Pagination<User>> {

    const { user_name, sort, orderBy } = filter

    const queryBuilder = this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.person', 'person')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('person.address', 'address')

    if (user_name) {
      queryBuilder
        .where('user.user_name like :user_name', { user_name: `%${user_name}%` })

    }

    if (orderBy == SortingType.ID) {

      queryBuilder.orderBy('user.user_id', `${sort === 'DESC' ? 'DESC' : 'ASC'}`)

    } else if (orderBy == SortingType.DATE) {

      queryBuilder.orderBy('user.create_at', `${sort === 'DESC' ? 'DESC' : 'ASC'}`)

    } else {
      queryBuilder.orderBy('person.person_name', `${sort === 'DESC' ? 'DESC' : 'ASC'}`)
    }


    const page = await paginate<User>(queryBuilder, filter)

    page.links.first = page.links.first === '' ? '' : `${page.links.first}&sort=${sort}&orderBy=${orderBy}`
    page.links.previous = page.links.previous === '' ? '' : `${page.links.previous}&sort=${sort}&orderBy=${orderBy}`
    page.links.last = page.links.last === '' ? '' : `${page.links.last}&sort=${sort}&orderBy=${orderBy}`
    page.links.next = page.links.next === '' ? '' : `${page.links.next}&sort=${sort}&orderBy=${orderBy}`

    return page
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.person', 'person')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('person.address', 'address')
      .where('user.user_id = :user_id', { user_id: id })
      .getOne()
  }

  async findByLogin(userLogin: string) {
    return this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.person', 'person')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('person.address', 'address')
      .where('user.user_login = :user_login', { user_login: userLogin })
      .getOne()
  }

  async update(id: number, updateUserDto: UpdateUserDto) {

    const {
      person: { person_cpf, person_email, person_name, person_rg, phone_numbers },
      address: { zipCode, address_number, city, country, district, state, street },
      user_password: password
    } = updateUserDto

    const userSaved = await this.findById(id)

    if (!userSaved) {
      throw new NotFoundException(`O usuário não foi encontrado!`)
    }

    const user = await this.userRepository.preload({
      user_id: id,
      ...updateUserDto
    })

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

    const personSaved = await this.personService.findByCpf(person_cpf)

    user.person = await this.personService.update(personSaved.person_id, person)

    if (password) {
      user.user_password = await hash(password)
    }

    await this.userRepository.save(user)

    return this.findById(id)
  }

  async changeStatus(id: number): Promise<User> {

    const userSaved = await this.findById(id)

    const { isActive: status } = userSaved

    userSaved.isActive = status === true ? false : true

    await this.userRepository.save(userSaved)

    return this.findById(id)


  }

  async updateRefreshToken(id: number, refresh_token: string) {
    return this.userRepository.createQueryBuilder()
      .update(User)
      .set({ refresh_token: refresh_token })
      .where("user_id = :id", { id })
      .execute();
  }
}
