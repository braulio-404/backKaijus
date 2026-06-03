import { IsNotEmpty, IsString, IsBoolean, IsOptional, IsNumber } from "class-validator";

export class CreateCategoriaDto {

    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsString()
    descripcion: string;

    @IsBoolean()
    activa: boolean;

    @IsOptional()
    @IsNumber()
    id?: number;

}
