/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginDTO } from './dto/login.dto';
import { AuthService } from './shared/auth.service';
import { LocalAuthGuard } from './shared/local-auth.guard';

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
