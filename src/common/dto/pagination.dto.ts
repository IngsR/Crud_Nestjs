// Mengimpor dekorator transformasi dan validasi
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

// Class DTO untuk menangani parameter paginasi
export class PaginationDto {
  // Parameter halaman (page), opsional
  @IsOptional()
  @Type(() => Number) // Mengubah input menjadi number
  @IsInt() // Validasi harus integer
  @Min(1) // Minimal halaman 1
  page?: number = 1; // Default halaman 1

  // Parameter batas per halaman (limit), opsional
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1) // Minimal 1 data
  @Max(100) // Maksimal 100 data per insert
  limit?: number = 10; // Default 10 data

  // Parameter pencarian (search), opsional
  @IsOptional()
  search?: string;
}
