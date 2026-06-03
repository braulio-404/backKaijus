import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: Record<string, any>) {
    // Validar que vengan los datos
    if (!loginDto.usernameOrEmail || !loginDto.password) {
      throw new UnauthorizedException('Se requiere username/email y contraseña');
    }

    // Validar credenciales
    const user = await this.authService.validateUser(
      loginDto.usernameOrEmail,
      loginDto.password,
    );

    // Generar y retornar el token JWT
    return this.authService.login(user);
  }
}
