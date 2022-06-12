import { ApiProperty } from "@nestjs/swagger"


export class CreateAddressDto {
    
    @ApiProperty({ required: true })
    zipCode: string

    @ApiProperty({ required: true })
    street: string

    @ApiProperty({ required: true })
    district: string

    @ApiProperty({ required: true })
    city: string

    @ApiProperty({ required: true })
    state: string

    @ApiProperty({ required: true })
    country: string

    @ApiProperty({ required: true })
    address_number: string
}
