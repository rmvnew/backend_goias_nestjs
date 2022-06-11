import { ApiProperty } from "@nestjs/swagger";
import { Company } from "src/company/entities/company.entity";
import { Person } from "src/person/entities/person.entity";


export class CreatePhoneDto {
    @ApiProperty()
    phone_number: string

    @ApiProperty({ required: true, type: Person })
    person: Person
}
