/*
https://docs.nestjs.com/providers#services
*/

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { hash } from 'src/common/utils/hash';
import { ProfileEntity } from 'src/profile/entities/profile.entity';
import { LoginDTO } from './dto/login.dto';
import Tokens from './interfaces/tokens';


@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    async validateUser(userLogin: string, userPassword: string) {

        const user = await this.userService.findByLogin(userLogin);

        const checkPass = bcrypt.compareSync(userPassword, user.user_password);

        if (user && checkPass) {

            return user
        }

        return null;
    }

    async login(user: any) {
        const payload = {
            sub: user.id_user,
            name: user.name,
            email: user.email,
        }
        return {
            access_token: this.jwtService.sign(payload),
        }
    }

    async loginWithDto(login: LoginDTO) {

        const user = await this.userService.findByLogin(login.login)

       

        if (!user) {
            throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
        }

        console.log(user);

        const { access_token, refresh_token } = await this.getTokens(user.person.person_email, user.person.person_name, user.profile);

       
        const hashed_refresh_token = await hash(refresh_token);

        await this.userService.updateRefreshToken(user.user_id, hashed_refresh_token);

        return {
            access_token: access_token,
            refresh_token: refresh_token,
            expires_in: this.configService.get('auth.token_expires_in'),
            name: user.person.person_name,
            email: user.person.person_email,
            profile: user.profile
        };

    }

    async getTokens(email: string, name: string, profile: ProfileEntity): Promise<Tokens> {
        
        const [access_token, refresh_token] = await Promise.all([
            this.jwtService.signAsync({
                email: email,
                name: name,
                profile: profile,
            },
                {
                    secret: process.env.JWT_SECRET,
                    expiresIn: process.env.JWT_EXPIRES_IN,
                    algorithm: 'HS256'

                }),
            this.jwtService.signAsync({
                email: email,
            },
                {
                    secret: process.env.JWT_SECRET,
                    expiresIn: process.env.JWT_EXPIRES_IN,
                    algorithm: 'HS256'
                })
        ]);

        

        return {
            access_token: access_token,
            refresh_token: refresh_token
        }
    }
}
