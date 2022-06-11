import { ApiProperty } from "@nestjs/swagger";
import { CreateAddressDto } from "src/address/dto/create-address.dto";


export class CreatePersonDto {

    @ApiProperty()
    person_name: string

    @ApiProperty({ type: [String], required: false })
    phone_numbers?: string

    @ApiProperty({ type: CreateAddressDto })
    address: CreateAddressDto

}
