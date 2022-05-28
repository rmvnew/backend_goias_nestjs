import { BadRequestException } from "@nestjs/common"
import { ValidType } from "../enums";


export class Validations {

    private static instance: Validations
    // private constructor() { }
    public static getInstance(): Validations {
        if (!Validations.instance) {
            Validations.instance = new Validations();
        }
        return Validations.instance;
    }



    // validateImageExtensions(file: BufferedFile) {
    //     if (!this.validRegex(/(.(jpg|png|bmp|jpeg))/gm, file.originalname)) {
    //         let extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
    //         throw new BadRequestException(`O formato ${extension} não é suportado. Utilize extensões .jpg, .png ou .bmp!`)
    //     }
    // }
   
    // validateVideoExtensions(file: BufferedFile) {
    //     if (!this.validRegex(/(.mp4)/gm, file.originalname)) {
    //         let extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
    //         throw new BadRequestException(`O formato ${extension} não é suportado. Utilize extensão .mp4!`)
    //     }
    // }

    // validSizeFile(file: BufferedFile, currentSize: FileSize) {

    //     if (file.size > currentSize) {
    //         throw new BadRequestException('O arquivo excede o tamanho permitido.')
    //     }

    // }

    getValidName(name: string) {

        let currentName = name.toUpperCase();

        this.validateWithRegex(
            currentName,
            ValidType.NO_SPECIAL_CHARACTER,
            ValidType.NO_MANY_SPACE,
            ValidType.IS_STRING,
        )

        return currentName;
    }

    validateWithRegex(str: string, ...valid) {

        valid.forEach(data => {

            if (data === ValidType.IS_NUMBER) {
                if (this.validRegex(/[a-zA-Z!@#$%^&*(),.?":{}|<>]/gm, str)) {
                    throw new BadRequestException(`O nome ${str}, deve conter apenas números`)
                }
            }

            if (data === ValidType.IS_NUMBER_FLOAT) {
                if (this.validRegex(/[a-zA-Z!@#$%^&*(),?":{}|<>]/gm, str)) {
                    throw new BadRequestException(`O nome ${str}, deve conter apenas números`)
                }
            }


            if (data === ValidType.IS_STRING) {
                if (this.validRegex(/[\d]/g, str)) {
                    throw new BadRequestException(`O nome ${str}, não pode conter números`);
                }
            }

            if (data === ValidType.NO_SPACE) {
                if (this.validRegex(/\s+/g, str)) {
                    throw new BadRequestException(`O nome ${str}, não pode conter espaços em branco!!`)
                }
            }

            if (data === ValidType.NO_MANY_SPACE) {
                if (this.validRegex(/\s +/g, str)) {
                    throw new BadRequestException(`O nome ${str}, não pode conter 2 ou mais espaços em branco!!`)
                }
            }

            if (data === ValidType.NO_SPECIAL_CHARACTER) {
                if (this.validRegex(/[!@#$%^&*(),.?":{}|<>-]/g, str)) {
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

    verifyLength(value: string, description: string = 'campo', min: number = null, max: number = null) {

        if (value === null || value === undefined || value === '') {
            throw new BadRequestException(`${description}: ${value}, não pode conter espaços vazios!`)
        }

        if (min !== null) {
            if (value.length < min) {
                throw new BadRequestException(`${description}: ${value}, não pode ter menos que ${min} caracteres!`)
            }
        }

        if (max !== null) {
            if (value.length > max) {
                throw new BadRequestException(`${description}: ${value}, não pode ter mais que ${max} caracteres!`)
            }
        }

    }


    validRegex(regex: RegExp, value: string): boolean {
        return regex.test(value);
    }

}