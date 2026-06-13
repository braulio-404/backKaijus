import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { CajaService } from './caja.service';
import { CreateCajaDto } from './dto/create-caja.dto';
import { UpdateCajaBalanceDto } from './dto/update-caja-balance.dto';

@Controller('caja')
export class CajaController {
  constructor(private readonly cajaService: CajaService) {}

  @Post()
  create(@Body() createCajaDto: CreateCajaDto) {
    return this.cajaService.create(createCajaDto);
  }

  @Get()
  findAll() {
    return this.cajaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cajaService.findOne(+id);
  }

  @Put(':id/movimiento')
  registrarMovimiento(
    @Param('id') id: string,
    @Body() updateCajaBalanceDto: UpdateCajaBalanceDto,
  ) {
    return this.cajaService.registrarMovimiento(+id, updateCajaBalanceDto);
  }
}
