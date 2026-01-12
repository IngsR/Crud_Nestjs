// Mengimpor PartialType
import { PartialType } from '@nestjs/mapped-types';
// Mengimpor CreateProductDto
import { CreateProductDto } from './create-product.dto';

// DTO untuk update produk (mewarisi CreateProductDto, semua field jadi opsional)
export class UpdateProductDto extends PartialType(CreateProductDto) {}
