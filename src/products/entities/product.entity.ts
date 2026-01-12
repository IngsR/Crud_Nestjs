// Mengimpor dekorator TypeORM
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
// Mengimpor Entity Category untuk relasi
import { Category } from '../../categories/entities/category.entity';

// Mendefinisikan tabel 'products'
@Entity({ name: 'products' })
export class Product {
  // Primary Key UUID
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Kolom nama produk (Unik)
  @Column({ unique: true })
  name: string;

  // Kolom deskripsi (Teks, Boleh kosong)
  @Column({ type: 'text', nullable: true })
  description: string;

  // Kolom harga (Decimal dengan presisi 10 digit, 2 desimal)
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  // Kolom stok (Integer, default 0)
  @Column({ type: 'int', default: 0 })
  stock: number;

  // Relasi Many-to-One ke Category
  @ManyToOne(() => Category, (category) => category.products, {
    nullable: true, // Produk boleh tidak punya kategori (opsional, tergantung bisnis)
    eager: false, // Tidak meload kategori secara otomatis kecuali diminta
  })
  @JoinColumn({ name: 'categoryId' }) // Menentukan foreign key column
  category: Category;

  // Kolom foreign key categoryId (untuk akses langsung ID tanpa join)
  @Column({ nullable: true })
  categoryId: string;

  // Status aktif produk
  @Column({ default: true })
  isActive: boolean;

  // Waktu pembuatan
  @CreateDateColumn()
  createdAt: Date;

  // Waktu update terakhir
  @UpdateDateColumn()
  updatedAt: Date;

  // Waktu penghapusan (Soft Delete)
  @DeleteDateColumn()
  deletedAt: Date;
}
