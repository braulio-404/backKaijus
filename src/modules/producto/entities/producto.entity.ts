import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Categoria } from "../../categoria/entities/categoria.entity";

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'int', default: 0 })
  unidadesVendidas: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  precioCompra: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  precioVenta: number;

  @Column({ type: 'text', nullable: true })
  imagenBase64: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  // Relación con Categoría (Muchos Productos pertenecen a Una Categoría)
  @ManyToOne(() => Categoria, { eager: true, nullable: false })
  @JoinColumn({ name: 'categoriaId' })
  categoria: Categoria;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
