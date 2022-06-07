import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { SortingType } from 'src/common/enums';
import { Repository } from 'typeorm';
import { CreateContractDto } from './dto/create-contract.dto';
import { FilterContract } from './dto/filter.contract';
import { Contract } from './entities/contract.entity';
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class ContractService {

  constructor(
    @InjectRepository(Contract)
    private readonly contractRepository: Repository<Contract>
  ) { }


  async create(createContractDto: CreateContractDto): Promise<Contract> {

    const contract = this.contractRepository.create(createContractDto)

    contract.contract_number = uuidv4()

    return this.contractRepository.save(contract)

  }

  async findAll(filter: FilterContract) {

    const { orderBy, sort } = filter

    const queryBuilder = this.contractRepository.createQueryBuilder('inf')
      .leftJoinAndSelect('inf.company', 'company')
      .where('inf.is_active = true')

    // if (cnpj) {
    //   return paginate<Company>(
    //     queryBuilder.where('inf.cnpj = :cnpj', { cnpj })
    //       .andWhere('inf.is_active = true'), filter
    //   )
    // }

    if (orderBy == SortingType.ID) {

      queryBuilder.orderBy('inf.contract_id', `${sort === 'DESC' ? 'DESC' : 'ASC'}`)
        .where('inf.is_active = true')

    } else if (orderBy == SortingType.DATE) {

      queryBuilder.orderBy('inf.create_at', `${sort === 'DESC' ? 'DESC' : 'ASC'}`)
        .where('inf.is_active = true')

    } else {

      queryBuilder.orderBy('inf.company_real_name', `${sort === 'DESC' ? 'DESC' : 'ASC'}`)
        .where('inf.is_active = true')

    }

    return paginate<Contract>(queryBuilder, filter)


  }

  async findById(id: number) {
    return this.contractRepository.findOne({
      where: {
        company_id: id
      }
    })
  }

  async remove(id: number) {

    const contractSaved = await this.findById(id)

    if (!contractSaved) {
      throw new BadRequestException('Id de contrato inválido')
    }

    contractSaved.isActive = false

    await this.contractRepository.save(contractSaved)

  }
}
