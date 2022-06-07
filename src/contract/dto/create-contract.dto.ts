import { ApiProperty } from "@nestjs/swagger";
import { Company } from "src/company/entities/company.entity";


export class CreateContractDto {
    @ApiProperty()
    value: number

    @ApiProperty({ required: true, type: Company })
    company: Company
}
