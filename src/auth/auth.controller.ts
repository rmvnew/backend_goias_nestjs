/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';



@ApiTags('Login')
@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService,
    ) { }


    // @UseGuards(LocalAuthGuard)
    // @Post('/login')
    // async login(@Request() req: any) {
    //     return this.authService.login(req.user);
    // }

    // @UseGuards(LocalAuthGuard)
    @Post('/login')
    async auth(@Body() auth: LoginDTO) {
        return this.authService.loginWithDto(auth)
    }
}
