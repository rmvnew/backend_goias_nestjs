import { ApiProperty } from "@nestjs/swagger";


export class CreatePersonDto {

    @ApiProperty()
    person_name: string

}
