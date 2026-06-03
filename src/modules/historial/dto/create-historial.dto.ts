import { IsNotEmpty, IsString } from 'class-validator';

export class CreateHistorialDto {
  @IsNotEmpty()
  @IsString()
  accion: string;

  @IsNotEmpty()
  @IsString()
  modulo: string;

  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @IsNotEmpty()
  @IsString()
  usuario: string;
}
