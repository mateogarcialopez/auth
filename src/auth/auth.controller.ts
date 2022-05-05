import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dtos/auth.dto';
import { RegisterDto } from './dtos/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('login')
  async login(@Body() data: AuthDto) {
    try {
      return this._authService.authenticateUser(data);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('register')
  async register(@Body() data: RegisterDto) {
    return await this._authService.registerUser(data);
  }
}
