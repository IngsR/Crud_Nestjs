// Mengimpor Transformator
import { Type } from 'class-transformer';
// Mengimpor Validator
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
// Mengimpor PaginationDto sebagai base class
import { PaginationDto } from '../../common/dto/pagination.dto';

// Enum untuk urutan sorting
export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

// DTO untuk query parameter pada endpoint get products
export class QueryProductDto extends PaginationDto {
  // Filter berdasarkan Category ID (Opsional)
  @IsOptional()
  @IsString()
  category?: string;

  // Filter harga minimum (Opsional)
  @IsOptional()
  @Type(() => Number) // Convert query param string ke number
  @IsNumber()
  @Min(0)
  minPrice?: number;

  // Filter harga maksimum (Opsional)
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  // Field untuk sorting, default 'createdAt'
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  // Urutan sorting (ASC/DESC), default DESC
  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder = SortOrder.DESC;
}
