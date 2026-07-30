import { IsNotEmpty, IsNumber, IsIn, Min } from 'class-validator';

export class AdjustStockDto {
  @IsNotEmpty({ message: 'La cantidad es requerida' })
  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @Min(1, { message: 'La cantidad a ajustar debe ser al menos 1' })
  cantidad: number;

  @IsNotEmpty({ message: 'El tipo de ajuste es requerido' })
  @IsIn(['sumar', 'restar'], { message: 'El tipo debe ser sumar o restar' })
  tipo: 'sumar' | 'restar';
}
