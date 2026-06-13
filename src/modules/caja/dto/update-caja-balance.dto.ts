import { IsNotEmpty, IsNumber, IsString, IsEnum, Min } from 'class-validator';

export class UpdateCajaBalanceDto {
  @IsNotEmpty({ message: 'El tipo de movimiento es obligatorio (ingreso o egreso)' })
  @IsEnum(['ingreso', 'egreso'], { message: 'El tipo de movimiento debe ser ingreso o egreso' })
  tipoMovimiento: 'ingreso' | 'egreso';

  @IsNotEmpty({ message: 'El medio de pago es obligatorio (efectivo o transferencia)' })
  @IsEnum(['efectivo', 'transferencia'], { message: 'El medio debe ser efectivo o transferencia' })
  medio: 'efectivo' | 'transferencia';

  @IsNotEmpty({ message: 'El monto es obligatorio' })
  @IsNumber({}, { message: 'El monto debe ser un número' })
  @Min(0.01, { message: 'El monto debe ser mayor a 0' })
  monto: number;

  @IsNotEmpty({ message: 'El comentario es obligatorio' })
  @IsString({ message: 'El comentario debe ser un texto' })
  comentario: string;
}
