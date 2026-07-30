import { IsBoolean, IsEmail, IsNotEmpty, IsString, IsOptional, IsEnum } from "class-validator";
import { Rol } from "../entities/usuario.entity";

export class CreateUsuarioDto {

    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsNotEmpty()
    @IsString()
    apellido: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    telefono: string;

    @IsBoolean()
    @IsNotEmpty()
    estado: boolean;

    @IsOptional()
    @IsEnum(Rol)
    rol?: string;

}

