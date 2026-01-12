// Mengimpor PartialType dari @nestjs/mapped-types
import { PartialType } from '@nestjs/mapped-types';
// Mengimpor CreateCategoryDto untuk di-extend
import { CreateCategoryDto } from './create-category.dto';

// Class DTO untuk update kategori (mewarisi CreateCategoryDto dengan semua field menjadi opsional)
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
