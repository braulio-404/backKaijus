import { IsBoolean, IsEmail, IsNotEmpty, IsString } from "class-validator";

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



}
