import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { Categoria } from '../categoria/entities/categoria.entity';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) { }

  async create(createProductoDto: CreateProductoDto) {
    try {
      const { categoriaId, id, categoria: tempCategoria, createdAt, updatedAt, ...productDetails } = createProductoDto;

      const categoria = await this.categoriaRepository.findOne({
        where: { id: categoriaId }
      });
      if (!categoria) {
        throw new NotFoundException(`Categoría con ID ${categoriaId} no encontrada`);
      }

      const producto = this.productoRepository.create({
        ...productDetails,
        categoria
      });

      const saved = await this.productoRepository.save(producto);

      return {
        ...saved,
        precioCompra: Number(saved.precioCompra),
        precioVenta: Number(saved.precioVenta),
        categoria: saved.categoria.nombre
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const productos = await this.productoRepository.find({
        where: { activo: true },
        relations: ['categoria']
      });

      return productos.map(p => ({
        ...p,
        precioCompra: Number(p.precioCompra),
        precioVenta: Number(p.precioVenta),
        categoria: p.categoria?.nombre || 'Sin Categoría'
      }));
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const producto = await this.productoRepository.findOne({
        where: { id, activo: true },
        relations: ['categoria']
      });

      if (!producto) {
        throw new NotFoundException(`Producto con ID ${id} no encontrado`);
      }

      return {
        ...producto,
        precioCompra: Number(producto.precioCompra),
        precioVenta: Number(producto.precioVenta),
        categoria: producto.categoria?.nombre || 'Sin Categoría'
      };
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateProductoDto: UpdateProductoDto) {
    try {
      const producto = await this.productoRepository.findOne({
        where: { id, activo: true }
      });

      if (!producto) {
        throw new NotFoundException(`Producto con ID ${id} no encontrado`);
      }

      const { categoriaId, id: bodyId, categoria: tempCategoria, createdAt, updatedAt, ...productDetails } = updateProductoDto;

      if (categoriaId) {
        const categoria = await this.categoriaRepository.findOne({
          where: { id: categoriaId }
        });
        if (!categoria) {
          throw new NotFoundException(`Categoría con ID ${categoriaId} no encontrada`);
        }
        producto.categoria = categoria;
      }

      Object.assign(producto, productDetails);
      const saved = await this.productoRepository.save(producto);

      return {
        ...saved,
        precioCompra: Number(saved.precioCompra),
        precioVenta: Number(saved.precioVenta),
        categoria: saved.categoria?.nombre || 'Sin Categoría'
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const producto = await this.productoRepository.findOne({
        where: { id }
      });

      if (!producto) {
        throw new NotFoundException(`Producto con ID ${id} no encontrado`);
      }

      producto.activo = false;
      await this.productoRepository.save(producto);
      return { success: true, message: 'Producto eliminado exitosamente' };
    } catch (error) {
      throw error;
    }
  }
}
