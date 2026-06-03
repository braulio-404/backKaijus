import { Injectable } from '@nestjs/common';
import { CreateHistorialDto } from './dto/create-historial.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Historial } from './entities/historial.entity';

@Injectable()
export class HistorialService {
  constructor(
    @InjectRepository(Historial)
    private readonly historialRepository: Repository<Historial>,
  ) {}

  async create(createHistorialDto: CreateHistorialDto) {
    try {
      const registro = this.historialRepository.create(createHistorialDto);
      return await this.historialRepository.save(registro);
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.historialRepository.find({
        order: {
          fecha: 'DESC',
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      return await this.historialRepository.findOne({ where: { id } });
    } catch (error) {
      throw error;
    }
  }
}
