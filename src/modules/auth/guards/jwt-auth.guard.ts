import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Esta clase usa automáticamente la JwtStrategy que creamos
  // y bloquea peticiones que no tengan un token válido.
}
