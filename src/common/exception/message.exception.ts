import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Exceptions } from "../enums";





export class ErrorMsg {

    private static instance: ErrorMsg

    public static it(): ErrorMsg {
        if (!ErrorMsg.instance) {
            ErrorMsg.instance = new ErrorMsg();
        }
        return ErrorMsg.instance;
    }


    getErrMessage(whereWas: string, data: string, err: Exceptions) {
        if (err === Exceptions.NOT_FOUND) {
            throw new NotFoundException(`${whereWas} with id ${data} not found! `)
        } else if (err === Exceptions.BAD_REQUEST) {
            throw new BadRequestException(`${whereWas}: could not create ${data}!`)
        } else if (err === Exceptions.ALREADY_EXISTS) {
            throw new BadRequestException(`${whereWas}: ${data} is already registered!`)
        }
    }






}