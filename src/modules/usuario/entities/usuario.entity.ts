
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

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

}
