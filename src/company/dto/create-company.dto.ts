import { ApiProperty } from "@nestjs/swagger"


export class CreateCompanyDto {

    @ApiProperty()
    company_real_name: string
    
    @ApiProperty()
    company_fantasy_name: string

    @ApiProperty()
    cnpj: string

}
