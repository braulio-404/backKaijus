import { IsArray, IsIn, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ItemDescontarDto {
  @IsNotEmpty()
  @IsNumber()
  productoId: number;

  @IsNotEmpty()
  @IsNumber()
  cantidad: number;

  @IsNotEmpty()
  @IsString()
  nombre: string; // Para el registro de historial

  @IsNotEmpty()
  @IsNumber()
  precioCompra: number; // Para calcular costo total en historial

  @IsNotEmpty()
  @IsNumber()
  precioVenta: number; // Para guardar el precio de venta en el historial
}

export class DescontarStockDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemDescontarDto)
  items: ItemDescontarDto[];

  /**
   * 'venta'   → descuenta stock + suma unidadesVendidas
   * 'torneo'  → descuenta stock solamente (regalo/premio)
   */
  @IsNotEmpty()
  @IsIn(['venta', 'torneo'])
  tipo: 'venta' | 'torneo';

  @IsNotEmpty()
  @IsString()
  metodoPago: string; // 'Efectivo', 'Débito', etc. (solo relevante en ventas)

  @IsNotEmpty()
  @IsNumber()
  totalVenta: number;

  @IsNotEmpty()
  @IsNumber()
  totalCosto: number;
}
