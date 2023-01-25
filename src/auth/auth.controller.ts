import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth, GetUser } from './decorators';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }


  @Post('login')
  login(@Body() logingUserDto: LoginUserDto) {
    return this.authService.login(logingUserDto);
  }

  @Get('me')
  @Auth()
  me(@GetUser() user: User) {
    return this.authService.me(user);
  }

}
