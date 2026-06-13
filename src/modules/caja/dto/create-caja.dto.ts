import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateCajaDto {
    @IsNotEmpty({ message: 'El usuario es obligatorio' })
    @IsString()
    usuario: string;

    @IsNotEmpty({ message: 'El monto en efectivo es obligatorio' })
    @IsNumber({}, { message: 'El monto en efectivo debe ser un número' })
    @Min(0, { message: 'El monto en efectivo no puede ser negativo' })
    montoEfectivo: number;

    @IsNotEmpty({ message: 'El monto en transferencia es obligatorio' })
    @IsNumber({}, { message: 'El monto en transferencia debe ser un número' })
    @Min(0, { message: 'El monto en transferencia no puede ser negativo' })
    montoTransferencia: number;

    @IsOptional()
    @IsString()
    comentarios?: string;
}
