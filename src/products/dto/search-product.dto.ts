// Mengimpor validator
import { IsNotEmpty, IsString } from 'class-validator';

// DTO untuk pencarian produk sederhana
export class SearchProductDto {
  // Keyword pencarian (String, Wajib)
  @IsString()
  @IsNotEmpty()
  q: string;
}
