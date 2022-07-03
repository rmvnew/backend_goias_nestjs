/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';




@ApiTags('Login')
@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService,
    ) { }


    
    @Post('/auth')
    async login(@Body() auth: LoginDTO) {
        return this.authService.login(auth);
    }

    
    @Post('/login')
    async auth(@Body() auth: LoginDTO) {
        return this.authService.loginWithDto(auth)
    }
}
