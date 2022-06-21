import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Address } from 'src/address/entities/address.entity';
import { SortingType, ValidType } from 'src/common/enums';
import { IsCnpj } from 'src/common/utils/IsCnpj';
import { Validations } from 'src/common/utils/validations';
import { Contract } from 'src/contract/entities/contract.entity';
import { CreatePhoneDto } from 'src/phone/dto/create-phone.dto';
import { PhoneService } from 'src/phone/phone.service';
import { Repository } from 'typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';
import { FilterCompany } from './dto/filter.company';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';
import { CreateContractDto } from 'src/contract/dto/create-contract.dto';
import { ContractService } from 'src/contract/contract.service';
import { ClientService } from 'src/client/client.service';
import { Client } from 'src/client/entities/client.entity';

@Injectable()
export class CompanyService {

  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly contractService: ContractService,
    private readonly phoneService: PhoneService,
    private readonly clientService: ClientService

  ) { }

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {

    const {
      cnpj,
      company_fantasy_name,
      company_real_name,
      clients_id
    } = createCompanyDto

    const isRegistered = await this.findByCnpj(cnpj, company_real_name)

    if (isRegistered) {
      throw new BadRequestException(`Empresa ${company_real_name} já está cadastrada!`)
    }

    const company = this.companyRepository.create(createCompanyDto)

    company.company_fantasy_name = company_fantasy_name.toUpperCase()

    company.company_real_name = company_real_name.toUpperCase()


    Validations.getInstance().validateWithRegex(
      company.company_fantasy_name,
      ValidType.IS_STRING,
      ValidType.NO_SPECIAL_CHARACTER,
      ValidType.NO_MANY_SPACE)

    Validations.getInstance().validateWithRegex(
      company.company_real_name,
      ValidType.IS_STRING,
      ValidType.NO_SPECIAL_CHARACTER,
      ValidType.NO_MANY_SPACE)

    company.cnpj = await IsCnpj.getInstance().validarCNPJ(cnpj)

    let listClients = []

    for (let client of clients_id) {
      
      listClients.push(await this.clientService.findByRegisterCompany(client))
    }

    company.clients = listClients

   


    company.isActive = true

    return this.companyRepository.save(company)


  }

  async findAll(filter: FilterCompany): Promise<Pagination<Company>> {
    const { orderBy, sort, cnpj } = filter

    const queryBuilder = this.companyRepository.createQueryBuilder('inf')
      .leftJoinAndSelect('inf.clients', 'clients')
      .leftJoinAndSelect('clients.person', 'person')
      // .leftJoinAndSelect('inf.phones', 'phones')
      .where('inf.is_active = true')

    if (cnpj) {
      return paginate<Company>(
        queryBuilder.where('inf.cnpj = :cnpj', { cnpj })
          .andWhere('inf.is_active = true'), filter
      )
    }

    if (orderBy == SortingType.ID) {

      queryBuilder.orderBy('inf.company_id', `${sort === 'DESC' ? 'DESC' : 'ASC'}`)
        .where('inf.is_active = true')

    } else if (orderBy == SortingType.DATE) {

      queryBuilder.orderBy('inf.create_at', `${sort === 'DESC' ? 'DESC' : 'ASC'}`)
        .where('inf.is_active = true')

    } else {

      queryBuilder.orderBy('inf.company_real_name', `${sort === 'DESC' ? 'DESC' : 'ASC'}`)
        .where('inf.is_active = true')

    }

    return paginate<Company>(queryBuilder, filter)
  }

  async findByCnpj(cnpj: string, name: string): Promise<Company> {
    return this.companyRepository.createQueryBuilder('company')
      .where('company.cnpj = :cnpj', { cnpj })
      .orWhere('company.company_real_name = :company_real_name', { company_real_name: name })
      .getOne()
  }

  async findById(id: number): Promise<Company> {
    return this.companyRepository.createQueryBuilder('company')
      .leftJoinAndSelect('company.address', 'address')
      .leftJoinAndSelect('company.phones', 'phones')
      .where('company.company_id = :company_id', { company_id: id })
      .andWhere('company.is_active = true')
      .getOne()
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {

    const {
      cnpj,
      company_fantasy_name,
      company_real_name,
      clients_id
    } = updateCompanyDto

    const isRegistered = await this.findById(id)

    if (!isRegistered) {
      throw new NotFoundException(`Company com id: ${id} não encontrada`)
    }


    const companySaved = await this.companyRepository.preload({
      company_id: id,
      ...updateCompanyDto
    })


    if (cnpj) {
      companySaved.cnpj = cnpj
    }

    if (company_real_name) {
      companySaved.company_real_name = company_real_name
    }

    let listClients = []

    for (let client of clients_id) {
      
      listClients.push(await this.clientService.findByRegisterCompany(client))
    }

    companySaved.clients = listClients

    

    if (company_fantasy_name) {
      companySaved.company_fantasy_name = company_fantasy_name
    }

    await this.companyRepository.save(companySaved)

    return this.findById(id)
  }

  async remove(id: number) {

    const companySaved = await this.findById(id)

    if (!companySaved) {
      throw new NotFoundException(`Company com id: ${id} não encontrada`)
    }

    companySaved.isActive = false

    await this.companyRepository.save(companySaved)
  }
}
