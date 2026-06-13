import { Injectable } from '@nestjs/common';
import { CreateCajaDto } from './dto/create-caja.dto';
import { UpdateCajaBalanceDto } from './dto/update-caja-balance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Caja } from './entities/caja.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CajaService {
  constructor(
    @InjectRepository(Caja)
    private readonly cajaRepository: Repository<Caja>
  ) { }

  async create(createCajaDto: CreateCajaDto) {
    try {
      const caja = this.cajaRepository.create(createCajaDto);
      const saved = await this.cajaRepository.save(caja);
      return {
        ok: true,
        message: 'Caja registrada exitosamente',
        caja: {
          ...saved,
          montoEfectivo: Number(saved.montoEfectivo),
          montoTransferencia: Number(saved.montoTransferencia)
        }
      };
    } catch (error) {
      return {
        ok: false,
        message: 'Error al registrar la caja',
        error: error.message
      };
    }
  }

  async findAll() {
    try {
      const cajas = await this.cajaRepository.find({
        order: { fecha: 'DESC' }
      });
      return {
        ok: true,
        cajas: cajas.map(c => ({
          ...c,
          montoEfectivo: Number(c.montoEfectivo),
          montoTransferencia: Number(c.montoTransferencia)
        }))
      };
    } catch (error) {
      return {
        ok: false,
        message: 'Error al obtener los registros de caja',
        error: error.message
      };
    }
  }

  async findOne(id: number) {
    try {
      const caja = await this.cajaRepository.findOne({ where: { id } });
      if (!caja) {
        return {
          ok: false,
          message: 'Registro de caja no encontrado'
        };
      }
      return {
        ok: true,
        caja: {
          ...caja,
          montoEfectivo: Number(caja.montoEfectivo),
          montoTransferencia: Number(caja.montoTransferencia)
        }
      };
    } catch (error) {
      return {
        ok: false,
        message: 'Error al obtener el registro de caja',
        error: error.message
      };
    }
  }

  async registrarMovimiento(id: number, updateCajaBalanceDto: UpdateCajaBalanceDto) {
    try {
      const caja = await this.cajaRepository.findOne({ where: { id } });
      if (!caja) {
        return {
          ok: false,
          message: 'Registro de caja no encontrado'
        };
      }

      let efectivo = Number(caja.montoEfectivo);
      let transferencia = Number(caja.montoTransferencia);
      const { tipoMovimiento, medio, monto, comentario } = updateCajaBalanceDto;

      if (tipoMovimiento === 'ingreso') {
        if (medio === 'efectivo') {
          efectivo += monto;
        } else {
          transferencia += monto;
        }
      } else if (tipoMovimiento === 'egreso') {
        if (medio === 'efectivo') {
          if (efectivo < monto) {
            return {
              ok: false,
              message: `Fondos insuficientes en efectivo. Disponible: $${efectivo}`
            };
          }
          efectivo -= monto;
        } else {
          if (transferencia < monto) {
            return {
              ok: false,
              message: `Fondos insuficientes en transferencia. Disponible: $${transferencia}`
            };
          }
          transferencia -= monto;
        }
      }

      // Generar registro legible para concatenar a los comentarios
      const fechaLocal = new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' });
      const tipoStr = tipoMovimiento === 'ingreso' ? 'INGRESO (+)' : 'EGRESO (-)';
      const medioStr = medio === 'efectivo' ? 'Efectivo' : 'Transferencia';
      const nuevoLog = `\n[${fechaLocal}] [${tipoStr}] [${medioStr}] $${monto.toLocaleString('es-CL')}: ${comentario}`;

      caja.montoEfectivo = efectivo;
      caja.montoTransferencia = transferencia;
      caja.comentarios = (caja.comentarios || '') + nuevoLog;

      const saved = await this.cajaRepository.save(caja);

      return {
        ok: true,
        message: 'Movimiento registrado exitosamente',
        caja: {
          ...saved,
          montoEfectivo: Number(saved.montoEfectivo),
          montoTransferencia: Number(saved.montoTransferencia)
        }
      };
    } catch (error) {
      return {
        ok: false,
        message: 'Error al registrar el movimiento en caja',
        error: error.message
      };
    }
  }
}
