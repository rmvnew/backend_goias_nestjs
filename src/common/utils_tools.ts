import { BadRequestException } from "@nestjs/common"
import * as bcrypt from 'bcrypt'
import { ValidType } from "./enums";

export class Utils {

    private static instance: Utils
    // private constructor() { }
    public static getInstance(): Utils {
        if (!Utils.instance) {
            Utils.instance = new Utils();
        }
        return Utils.instance;
    }

    getValidName(name: string) {

        let currentName = name.toUpperCase()

        this.validateWithRegex(
            currentName,
            ValidType.IS_STRING,
            ValidType.NO_SPACE,
            ValidType.NO_SPECIAL_CHARACTER
        )


        return currentName;
    }

    async encryptPassword(pass: string) {
        const saltOrRounds = 10;
        return bcrypt.hash(pass, saltOrRounds)
    }

    async isMatchHash(value: string, hash: string): Promise<boolean> {
        return bcrypt.compare(value, hash);
    }

    getDate(date: string): Date {

        this.validateWithRegex(date, ValidType.DATE)

        let newData = date.replace(/(\d+[/])(\d+[/])/, '$2$1');

        const dateSplited = newData.split('/')
        
        if (Number(dateSplited[0]) > 12 || Number(dateSplited[1]) > 31) {
            throw new BadRequestException('Data informáda inválida!!')
        }

        return new Date(newData);

    }


    getFormatedUsDate(date: string) {

        const currentDate = date.split('/')
        const day = currentDate[0]
        const month = currentDate[1]
        const year = currentDate[2]
        return new Date(`${year}/${month}/${day}`)

    }


    validateWithRegex(str: string, ...valid) {

        valid.forEach(data => {

            if (data === ValidType.IS_NUMBER) {
                if (this.validRegex(/[a-zA-Z!@#$%^&*(),.?":{}|<>]/gm, str)) {
                    throw new BadRequestException(`O nome ${str}, deve conter apenas números`)
                }
            }

            if (data === ValidType.IS_STRING) {
                if (this.validRegex(/[0-9]/g, str)) {
                    throw new BadRequestException(`O nome ${str}, não pode conter números`);
                }
            }

            if (data === ValidType.NO_SPACE) {
                if (this.validRegex(/\s +/g, str)) {
                    throw new BadRequestException(`O nome ${str}, não pode conter 2 ou mais espaços em branco!!`)
                }
            }

            if (data === ValidType.NO_SPECIAL_CHARACTER) {
                if (this.validRegex(/[!@#$%^&*(),.?":{}|<>]/g, str)) {
                    throw new BadRequestException(`O nome ${str}, não pode conter caracteres especiais!!`)
                }
            }

            if (data === ValidType.IS_EMAIL) {
                if (this.validRegex(/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+/i, str)) {
                    throw new BadRequestException('O email informado não é válido!!')
                }
            }

            if (data === ValidType.DATE) {
                if (!this.validRegex(/\d{2}\/\d{2}\/\d{4}/g, str)) {
                    throw new BadRequestException(`Data ${str} está em um formato inválido!`)
                }
            }

        })
    }

    verifyLength(name: string, min: number = null, max: number = null) {

        if (name === null || name === undefined || name === '') {
            throw new BadRequestException(`O nome: ${name}, não pode conter espaços vazios!`)
        }

        if (min !== null) {
            if (name.length < min) {
                throw new BadRequestException(`O nome ${name}, não pode ter menos que ${min} caracteres!`)
            }
        }

        if (max !== null) {
            if (name.length > max) {
                throw new BadRequestException(`O nome ${name}, não pode ter mais que ${max} caracteres!`)
            }
        }

    }

    private validRegex(regex: RegExp, value: string): boolean {
        return regex.test(value);
    }


}