import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { DescontarStockDto } from './dto/descontar-stock.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Rol } from '../usuario/entities/usuario.entity';

@Controller('productos')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productoService.create(createProductoDto);
  }

  // IMPORTANTE: Esta ruta debe ir ANTES de :id para que NestJS no la confunda
  // Nota: descontarStock es usado por ventas y torneos. Lo permitimos para cualquier usuario autenticado.
  @Post('descontar')
  @UseGuards(JwtAuthGuard)
  descontarStock(@Body() descontarStockDto: DescontarStockDto) {
    return this.productoService.descontarStock(descontarStockDto);
  }

  @Get()
  findAll() {
    return this.productoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productoService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Rol.SUPER_ADMIN)
  update(@Param('id') id: string, @Body() updateProductoDto: UpdateProductoDto) {
    return this.productoService.update(+id, updateProductoDto);
  }

  @Patch(':id/stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Rol.SUPER_ADMIN)
  adjustStock(
    @Param('id') id: string,
    @Body() adjustStockDto: { cantidad: number; tipo: 'sumar' | 'restar' },
    @Request() req: any
  ) {
    return this.productoService.adjustStock(+id, adjustStockDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Rol.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.productoService.remove(+id);
  }
}


