import { IsNotEmpty, IsString, IsNumber, IsOptional, IsBoolean } from "class-validator";

export class CreateProductoDto {
  @IsNotEmpty({ message: 'Falta agregar nombre' })
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsNotEmpty({ message: 'Falta agregar stock' })
  @IsNumber({}, { message: 'El stock debe ser un número' })
  stock: number;

  @IsOptional()
  @IsNumber()
  unidadesVendidas?: number;

  @IsNotEmpty({ message: 'Falta agregar precio de compra' })
  @IsNumber({}, { message: 'El precio de compra debe ser un número' })
  precioCompra: number;

  @IsNotEmpty({ message: 'Falta agregar precio de venta' })
  @IsNumber({}, { message: 'El precio de venta debe ser un número' })
  precioVenta: number;

  @IsOptional()
  @IsString()
  imagenBase64?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  // ID de la categoría a la que pertenece
  @IsNotEmpty({ message: 'Falta agregar categoría' })
  @IsNumber({}, { message: 'La categoría seleccionada no es válida' })
  categoriaId: number;

  // Propiedades opcionales que puede enviar el front-end para evitar errores de validación
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsOptional()
  @IsString()
  categoria?: string;

  @IsOptional()
  createdAt?: any;

  @IsOptional()
  updatedAt?: any;
}
