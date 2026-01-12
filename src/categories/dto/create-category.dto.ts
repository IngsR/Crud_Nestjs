// Mengimpor validator dari class-validator
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

// Class DTO (Data Transfer Object) untuk membuat kategori baru
export class CreateCategoryDto {
  // Validasi: harus berupa string
  @IsString()
  // Validasi: tidak boleh kosong
  @IsNotEmpty()
  name: string; // Nama kategori

  // Validasi: harus berupa string
  @IsString()
  // Validasi: opsional (boleh tidak ada)
  @IsOptional()
  description?: string; // Deskripsi kategori

  // Validasi: harus berupa boolean (true/false)
  @IsBoolean()
  // Validasi: opsional
  @IsOptional()
  isActive?: boolean; // Status aktif kategori
}
