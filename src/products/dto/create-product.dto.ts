// Mengimpor validator dari class-validator
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

// DTO untuk membuat produk baru
export class CreateProductDto {
  // Nama produk (String, tidak boleh kosong)
  @IsString()
  @IsNotEmpty()
  name: string;

  // Deskripsi produk (String, Opsional)
  @IsString()
  @IsOptional()
  description?: string;

  // Harga produk (Angka, Minimal 0)
  @IsNumber()
  @Min(0)
  price: number;

  // Stok produk (Integer, Minimal 0, Opsional)
  @IsInt()
  @Min(0)
  @IsOptional()
  stock?: number;

  // ID Kategori (Format UUID, Opsional)
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  // Status aktif (Boolean, Opsional, Default biasanya true di entity)
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
