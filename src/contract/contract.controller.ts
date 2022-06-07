import { Controller, Get, Param, Delete, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ContractService } from './contract.service';
import { FilterContract } from './dto/filter.contract';

@Controller('contract')
@ApiTags('Contract')
export class ContractController {
  constructor(private readonly contractService: ContractService) { }


  @Get()
  async findAll(
    @Query() filter: FilterContract
  ) {
    const { limit } = filter

    filter.limit = limit > 10 ? 10 : limit

    filter.route = `${process.env.URL}/contract`

    return this.contractService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contractService.findById(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
     this.contractService.remove(+id);
  }
}
