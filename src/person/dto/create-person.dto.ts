import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { CreateAddressDto } from "src/address/dto/create-address.dto";
import { Address } from "src/address/entities/address.entity";


export class CreatePersonDto {

    @ApiProperty()
    person_name: string

    @ApiProperty()
    person_rg: string

    @ApiProperty()
    person_cpf: string

    @ApiProperty()
    person_email: string

    @ApiProperty({ type: [String], required: false })
    phone_numbers?: string

    @ApiHideProperty()
    address: Address

}
