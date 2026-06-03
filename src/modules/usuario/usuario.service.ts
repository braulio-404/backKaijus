import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';

@Injectable()
export class UsuarioService {

  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) { }


  async create(createUsuarioDto: CreateUsuarioDto) {
    try {
      const usuario = this.usuarioRepository.create(createUsuarioDto);
      const validateEmail = await this.usuarioRepository.findOne({ where: { email: createUsuarioDto.email } });
      if (validateEmail) {
        throw new Error('El correo ya existe');
      }

      const validateUsername = await this.usuarioRepository.findOne({ where: { username: createUsuarioDto.username } });
      if (validateUsername) {
        throw new Error('El nombre de usuario ya existe');
      }

      // Encriptar la contraseña antes de guardar
      usuario.password = await argon2.hash(createUsuarioDto.password);

      const user = await this.usuarioRepository.save(usuario);
      // @ts-ignore
      delete user.password;
      return { success: true, message: 'Usuario agregado exitosamente' };
    } catch (error) {
      return { success: false, message: error.message };
    }




  }

  async findAll() {
    try {
      const usuarios = await this.usuarioRepository.find();
      return { success: true, data: usuarios };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async findOne(id: number) {
    try {
      const usuario = await this.usuarioRepository.findOne({ where: { id } });
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }
      return { success: true, data: usuario };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    try {
      const usuario = await this.usuarioRepository.findOne({ where: { id } });
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      if (updateUsuarioDto.password) {
        updateUsuarioDto.password = await argon2.hash(updateUsuarioDto.password);
      }

      const updatedUsuario = Object.assign(usuario, updateUsuarioDto);
      await this.usuarioRepository.save(updatedUsuario);
      return { success: true, message: 'Usuario actualizado exitosamente' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async remove(id: number) {
    try {
      const usuario = await this.usuarioRepository.findOne({ where: { id } });
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }
      await this.usuarioRepository.update({ id }, { estado: false });
      return { success: true, message: 'Usuario eliminado exitosamente' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Método usado por el AuthService para validar login
  async findByEmailOrUsername(usernameOrEmail: string) {
    return await this.usuarioRepository.findOne({
      where: [
        { email: usernameOrEmail },
        { username: usernameOrEmail }
      ]
    });
  }
}
