import { ApiProperty } from "@nestjs/swagger";
import { CreateAddressDto } from "src/address/dto/create-address.dto";
import { CreatePersonDto } from "src/person/dto/create-person.dto";



export class CreateClientDto {

    @ApiProperty({ required: true, type: CreatePersonDto })
    person: CreatePersonDto

    @ApiProperty({ type: CreateAddressDto })
    address: CreateAddressDto


}
