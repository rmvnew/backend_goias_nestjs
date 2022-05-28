import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Address } from 'src/address/entities/address.entity';
import { SortingType, ValidType } from 'src/common/enums';
import { IsCnpj } from 'src/common/utils/IsCnpj';
import { Validations } from 'src/common/utils/validations';
import { Repository } from 'typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';
import { FilterCompany } from './dto/filter.company';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';

@Injectable()
export class CompanyService {

  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>
  ) { }

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {

    const { cnpj, company_fantasy_name, company_real_name, address } = createCompanyDto

    const company = this.companyRepository.create(createCompanyDto)

    console.log(company.address)

    company.company_fantasy_name = company_fantasy_name.toUpperCase()

    company.company_real_name = company_real_name.toUpperCase()

    company.address.city = address.city.toUpperCase()

    company.address.street = address.street.toUpperCase()

    company.address.state = address.state.toUpperCase()

    company.address.country = address.country.toUpperCase()

    company.address.isActive = true

    company.address = await this.addressRepository.save(company.address)

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

    company.isActive = true

    return this.companyRepository.save(company)
  }

  async findAll(filter: FilterCompany): Promise<Pagination<Company>> {
    const { orderBy, sort, cnpj } = filter

    const queryBuilder = this.companyRepository.createQueryBuilder('inf')
      .leftJoinAndSelect('inf.address', 'address')
      .where('inf.is_active = true')

    if (cnpj) {
      return paginate<Company>(
        queryBuilder.where('inf.cnpj = :cnpj', { cnpj })
          .andWhere('inf.is_active = true'), filter
      )
    }

    if (orderBy == SortingType.ID) {

      queryBuilder.orderBy('inf.iduser', `${sort === 'DESC' ? 'DESC' : 'ASC'}`)
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

  async findByCnpj(cnpj: string): Promise<Company> {
    return this.companyRepository.findOne({
      where: {
        cnpj
      }
    })
  }

  async findById(id: number): Promise<Company> {
    return this.companyRepository.findOne({
      where: {
        company_id: id
      }
    })
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {

    const { cnpj, company_fantasy_name, company_real_name } = updateCompanyDto

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
