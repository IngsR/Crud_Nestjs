// Mengimpor dekorator TypeORM untuk definisi entitas
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
// Mengimpor entitas Product untuk relasi
import { Product } from '../../products/entities/product.entity';

// Menandai kelas ini sebagai entitas database dengan nama tabel 'categories'
@Entity({ name: 'categories' })
export class Category {
  // Kolom Primary Key dengan tipe UUID yang digenerate otomatis
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Kolom nama kategori, harus unik
  @Column({ unique: true })
  name: string;

  // Kolom deskripsi dengan tipe teks, boleh kosong (nullable)
  @Column({ type: 'text', nullable: true })
  description: string;

  // Relasi One-to-Many ke entitas Product (satu kategori bisa punya banyak produk)
  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  // Kolom status aktif, default true
  @Column({ default: true })
  isActive: boolean;

  // Mencatat waktu pembuatan data otomatis
  @CreateDateColumn()
  createdAt: Date;

  // Mencatat waktu update data otomatis
  @UpdateDateColumn()
  updatedAt: Date;

  // Mencatat waktu penghapusan data (soft delete) otomatis
  @DeleteDateColumn()
  deletedAt: Date;
}
