// Mengimpor dekorator TypeORM
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// Enum untuk Role User
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

// Mendefinisikan tabel 'app_users' (menghindari nama 'users' yang kadang reserved word di DB tertentu)
@Entity({ name: 'app_users' })
export class User {
  // Primary Key UUID
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Email harus unik
  @Column({ unique: true })
  email: string;

  // Password (disimpan dalam bentuk hash), nullable true jika via OAuth (opsional)
  @Column({ nullable: true })
  password?: string;

  // Role dengan tipe enum, default USER
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  // Status aktif
  @Column({ default: true })
  isActive: boolean;

  // Waktu pembuatan
  @CreateDateColumn()
  createdAt: Date;

  // Waktu update terakhir
  @UpdateDateColumn()
  updatedAt: Date;

  // Waktu soft delete
  @DeleteDateColumn()
  deletedAt: Date;
}
