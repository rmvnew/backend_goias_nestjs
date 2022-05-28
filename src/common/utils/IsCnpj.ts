import { BadRequestException } from "@nestjs/common";
import { ValidType } from "../enums";
import { Validations } from "./validations";

export class IsCnpj {

    private static instance: IsCnpj
    public static getInstance(): IsCnpj {
        if (!IsCnpj.instance) {
            IsCnpj.instance = new IsCnpj();
        }
        return IsCnpj.instance;
    }
    async validarCNPJ(cnpj: string) {


        let numeros;
        let tamanho;
        let soma;
        let pos;
        let digitos;
        let resultado;

        Validations.getInstance().validateWithRegex(cnpj, ValidType.IS_CNPJ)

        cnpj = cnpj.replace(/[^\d]+/g, '');


        if (cnpj == '') throw new BadRequestException(`CNPJ ${cnpj} é inválido`)

        if (cnpj.length != 14)
            throw new BadRequestException(`CNPJ ${cnpj} é inválido`)

        // Elimina CNPJs invalidos conhecidos
        if (cnpj == "00000000000000" ||
            cnpj == "11111111111111" ||
            cnpj == "22222222222222" ||
            cnpj == "33333333333333" ||
            cnpj == "44444444444444" ||
            cnpj == "55555555555555" ||
            cnpj == "66666666666666" ||
            cnpj == "77777777777777" ||
            cnpj == "88888888888888" ||
            cnpj == "99999999999999")
            throw new BadRequestException(`CNPJ ${cnpj} é inválido`)

        // Valida DVs
        tamanho = cnpj.length - 2
        numeros = cnpj.substring(0, tamanho);
        digitos = cnpj.substring(tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2)
                pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(0))
            throw new BadRequestException(`CNPJ ${cnpj} é inválido`)

        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2)
                pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;

        if (resultado != digitos.charAt(1)) {
            throw new BadRequestException(`CNPJ ${cnpj} é inválido`)
        } else {
            return cnpj
        }



    }
}