import { ApiProperty } from "@nestjs/swagger";
import { Company } from "src/company/entities/company.entity";


export class CreatePhoneDto {
    @ApiProperty()
    phone_number: string

    @ApiProperty({ required: true, type: Company })
    company: Company
}
