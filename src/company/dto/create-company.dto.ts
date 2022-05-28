import { ApiProperty } from "@nestjs/swagger"
import { CreateAddressDto } from "src/address/dto/create-address.dto"



export class CreateCompanyDto {

    @ApiProperty()
    company_real_name: string

    @ApiProperty()
    company_fantasy_name: string

    @ApiProperty()
    cnpj: string

    @ApiProperty({ type: CreateAddressDto })
    address: CreateAddressDto

}
