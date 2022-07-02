import { ApiProperty } from "@nestjs/swagger"
import { CreateAddressDto } from "src/address/dto/create-address.dto"
import { CreatePersonDto } from "src/person/dto/create-person.dto"



export class CreateUserDto {

    @ApiProperty()
    user_login: string

    @ApiProperty()
    user_password: string

    @ApiProperty({ required: true, type: CreatePersonDto })
    person: CreatePersonDto

    @ApiProperty({ type: CreateAddressDto })
    address: CreateAddressDto


}
