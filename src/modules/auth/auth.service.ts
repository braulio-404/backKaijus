import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from '../usuario/usuario.service';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
  ) {}

  async validateUser(usernameOrEmail: string, pass: string): Promise<any> {
    const user = await this.usuarioService.findByEmailOrUsername(usernameOrEmail);
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // Verificar la contraseña con argon2
    const isPasswordValid = await argon2.verify(user.password, pass);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    if (!user.estado) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    // Ocultamos la contraseña antes de devolver el usuario
    const { password, ...result } = user;
    return result;
  }

  async login(user: any) {
    // Este es el payload que irá dentro del JWT (Cuerpo del token)
    const payload = { 
      username: user.username, 
      sub: user.id, // 'sub' (subject) es el estandar para el ID
      email: user.email,
      rol: user.rol
    };
    
    return {
      success: true,
      message: 'Autenticación exitosa',
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        rol: user.rol
      }
    };
  }
}
