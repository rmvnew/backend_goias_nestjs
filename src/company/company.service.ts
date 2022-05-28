import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidType } from 'src/common/enums';
import { IsCnpj } from 'src/common/IsCnpj';
import { Validations } from 'src/common/utils/validations';
import { Repository } from 'typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';

@Injectable()
export class CompanyService {

  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>
  ) { }

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {

    const { cnpj, company_fantasy_name, company_real_name } = createCompanyDto

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

    company.isActive = true

    return this.companyRepository.save(company)
  }

  async findAll() {
    return this.companyRepository.find()
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
