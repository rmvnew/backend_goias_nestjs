import { ApiProperty } from "@nestjs/swagger"
import { CreateContractDto } from "src/contract/dto/create-contract.dto"



export class CreateCompanyDto {

    @ApiProperty()
    company_real_name: string

    @ApiProperty()
    company_fantasy_name: string

    @ApiProperty()
    cnpj: string

    @ApiProperty()
    clients_id: number[]

}
