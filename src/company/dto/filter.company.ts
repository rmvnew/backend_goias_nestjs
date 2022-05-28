import { ApiProperty } from "@nestjs/swagger";
import { FilterPagination } from "src/common/filter.pagination";


export class FilterCompany extends FilterPagination {

    @ApiProperty({ required: false })
    cnpj: string


}