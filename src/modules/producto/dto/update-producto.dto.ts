import { PartialType } from '@nestjs/mapped-types';
import { CreateProductoDto } from './create-producto.dto';
import { IsOptional, IsNumber, IsString } from 'class-validator';

export class UpdateProductoDto extends PartialType(CreateProductoDto) {
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
