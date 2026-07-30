import { IsBoolean, IsEmail, IsNotEmpty, IsString, IsOptional, IsEnum } from "class-validator";
import { Rol } from "../entities/usuario.entity";

export class CreateUsuarioDto {

    @IsNotEmpty({ message: 'Falta agregar nombre' })
    @IsString()
    nombre: string;

    @IsNotEmpty({ message: 'Falta agregar apellido' })
    @IsString()
    apellido: string;

    @IsNotEmpty({ message: 'Falta agregar correo electrónico' })
    @IsEmail({}, { message: 'El correo electrónico no es válido' })
    email: string;

    @IsNotEmpty({ message: 'Falta agregar nombre de usuario' })
    @IsString()
    username: string;

    @IsNotEmpty({ message: 'Falta agregar contraseña' })
    @IsString()
    password: string;

    @IsNotEmpty({ message: 'Falta agregar teléfono' })
    @IsString()
    telefono: string;

    @IsBoolean()
    @IsNotEmpty({ message: 'Falta agregar estado' })
    estado: boolean;

    @IsOptional()
    @IsEnum(Rol, { message: 'El rol seleccionado no es válido' })
    rol?: string;

}

