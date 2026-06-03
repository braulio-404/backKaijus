import { IsNotEmpty, IsString, IsNumber, IsOptional, IsBoolean, IsUUID } from "class-validator";

export class CreateProductoDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsNotEmpty()
  @IsNumber()
  stock: number;

  @IsOptional()
  @IsNumber()
  unidadesVendidas?: number;

  @IsNotEmpty()
  @IsNumber()
  precioCompra: number;

  @IsNotEmpty()
  @IsNumber()
  precioVenta: number;

  @IsOptional()
  @IsString()
  imagenBase64?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  // ID de la categoría a la que pertenece
  @IsNotEmpty()
  @IsNumber()
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
