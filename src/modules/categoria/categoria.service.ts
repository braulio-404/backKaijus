import { Injectable } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Categoria } from './entities/categoria.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriaService {

  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>
  ) { }


  async create(createCategoriaDto: CreateCategoriaDto) {
    try {
      const { id, ...categoriaDetails } = createCategoriaDto;
      const categoria = this.categoriaRepository.create(categoriaDetails);
      const savedCategoria = await this.categoriaRepository.save(categoria);
      return {
        ok: true,
        message: 'Categoría creada exitosamente',
        categoria: savedCategoria
      }
    } catch (error) {
      return {
        message: 'Error al crear la categoría',
        error: error.message
      }
    }
  }


  async findAll() {
    try {
      const categoria = await this.categoriaRepository.find({ order: { id: 'ASC' } });
      return {
        ok: true,
        categoria
      }
    } catch (error) {
      return {
        ok: false,
        message: 'Error al obtener las categorías',
        error: error.message
      }
    }
  }

  async findOne(id: number) {
    try {
      const categoria = await this.categoriaRepository.findOne({ where: { id } });
      if (!categoria) {
        return {
          ok: false,
          message: 'Categoría no encontrada'
        }
      }
      return {
        ok: true,
        categoria
      }
    } catch (error) {
      return {
        ok: false,
        message: 'Error al obtener la categoría',
        error: error.message
      }
    }
  }

  async update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    try {
      const { id: bodyId, ...categoriaDetails } = updateCategoriaDto;
      await this.categoriaRepository.update(id, categoriaDetails);
      const updatedCategoria = await this.categoriaRepository.findOne({ where: { id } });
      return {
        ok: true,
        message: 'Categoría actualizada exitosamente',
        categoria: updatedCategoria
      }
    } catch (error) {
      return {
        ok: false,
        message: 'Error al actualizar la categoría',
        error: error.message
      }
    }
  }

}
