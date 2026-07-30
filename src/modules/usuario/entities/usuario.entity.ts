
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

export enum Rol {
  SUPER_ADMIN = 'superadmin',
  VENTAS = 'ventas'
}

@Entity('usuarios')
export class Usuario {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 150 })
    nombre: string;

    @Column({ type: 'varchar', length: 150 })
    apellido: string;

    @Column({ type: 'varchar', length: 150, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 150, unique: true })
    username: string;

    @Column({ type: 'varchar', length: 150 })
    password: string;

    @Column({ type: 'varchar', length: 150 })
    telefono: string;

    @Column({ type: 'boolean', default: true })
    estado: boolean;

    @Column({ type: 'varchar', length: 50, default: Rol.VENTAS })
    rol: string;

}

