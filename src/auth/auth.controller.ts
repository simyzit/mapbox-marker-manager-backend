// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Controller, Get, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Auth } from './guards/jwt.guard';
import { CurrentUser } from './decorators/user.decorator';
import { UserDocument } from 'src/user/entities/user.entity';
import { RefreshDto } from './dto/refresh.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(201)
  async register(@Body() body: RegisterDto) {
    const { name, email, verificationToken } =
      await this.authService.register(body);
    return { name, email, verificationToken };
  }

  @Get('cron')
  @HttpCode(201)
  async send() {
    return { message: 'ok' };
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Get('logout')
  @HttpCode(204)
  @Auth()
  async logout(@CurrentUser('_id') _id: Pick<UserDocument, '_id'>) {
    await this.authService.logout(_id);
    return {};
  }

  @Post('refresh')
  @HttpCode(200)
  async refreshToken(@Body() body: RefreshDto) {
    return await this.authService.refreshToken(body.refreshToken);
  }
}
