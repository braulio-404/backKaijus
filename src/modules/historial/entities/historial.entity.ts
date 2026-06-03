import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity('historial')
export class Historial {

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    fecha: Date;

    @Column({ type: 'varchar', length: 50 })
    accion: string;

    @Column({ type: 'varchar', length: 50 })
    modulo: string;

    @Column({ type: 'text' })
    descripcion: string;

    @Column({ type: 'varchar', length: 150 })
    usuario: string;

}
