import { ApiProperty } from "@nestjs/swagger"
import { CreateAddressDto } from "src/address/dto/create-address.dto"
import { CreateContractDto } from "src/contract/dto/create-contract.dto"



export class CreateCompanyDto {

    @ApiProperty()
    company_real_name: string

    @ApiProperty()
    company_fantasy_name: string

    @ApiProperty()
    cnpj: string

    @ApiProperty({ type: CreateContractDto })
    contract: CreateContractDto

}
