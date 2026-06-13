import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity('cajas')
export class Caja {

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    fecha: Date;

    @Column({ type: 'varchar', length: 150 })
    usuario: string;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    montoEfectivo: number;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    montoTransferencia: number;

    @Column({ type: 'text', nullable: true })
    comentarios: string;
}
