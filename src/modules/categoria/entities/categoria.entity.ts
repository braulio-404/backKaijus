import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";


@Entity('categorias')
export class Categoria {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 150, unique: true })
    nombre: string;

    @Column({ type: 'text', nullable: true })
    descripcion: string;

    @Column({ type: 'boolean', default: true })
    activa: boolean;

}
