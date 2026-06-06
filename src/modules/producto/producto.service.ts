import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { DescontarStockDto } from './dto/descontar-stock.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { Categoria } from '../categoria/entities/categoria.entity';
import { HistorialService } from '../historial/historial.service';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
    private readonly historialService: HistorialService,
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

  /**
   * Descuenta stock de múltiples productos en una sola operación.
   * - tipo 'venta'  → descuenta stock + incrementa unidadesVendidas + registra en historial
   * - tipo 'torneo' → descuenta stock solamente (premio/regalo) + registra en historial
   */
  async descontarStock(dto: DescontarStockDto) {
    const errores: string[] = [];

    for (const item of dto.items) {
      const producto = await this.productoRepository.findOne({
        where: { id: item.productoId, activo: true },
      });

      if (!producto) {
        errores.push(`Producto ID ${item.productoId} no encontrado`);
        continue;
      }

      if (producto.stock < item.cantidad) {
        errores.push(`Stock insuficiente para "${producto.nombre}" (disponible: ${producto.stock}, solicitado: ${item.cantidad})`);
        continue;
      }

      // Descontamos el stock siempre
      producto.stock -= item.cantidad;

      // Solo en ventas incrementamos unidadesVendidas
      if (dto.tipo === 'venta') {
        producto.unidadesVendidas = (producto.unidadesVendidas || 0) + item.cantidad;
      }

      await this.productoRepository.save(producto);
    }

    if (errores.length > 0) {
      throw new BadRequestException(errores);
    }

    // Descripción legible para el historial
    const resumen = dto.items
      .map(i => `${i.nombre} x${i.cantidad} [pv:${(i as any).precioVenta ?? 0}]`)
      .join(', ');

    const ganancia = dto.totalVenta - dto.totalCosto;

    const descripcion = dto.tipo === 'venta'
      ? `Venta registrada | Total: $${dto.totalVenta.toLocaleString('es-CL')} | Costo: $${dto.totalCosto.toLocaleString('es-CL')} | Ganancia: $${ganancia.toLocaleString('es-CL')} | Pago: ${dto.metodoPago} | Items: ${resumen}`
      : `Descuento por torneo | Items entregados: ${resumen}`;

    await this.historialService.create({
      accion: dto.tipo === 'venta' ? 'VENTA' : 'TORNEO',
      modulo: 'Productos',
      descripcion,
      usuario: 'Sistema',
    });

    return {
      ok: true,
      message: dto.tipo === 'venta' ? 'Venta registrada exitosamente' : 'Stock descontado por torneo exitosamente',
    };
  }
}
