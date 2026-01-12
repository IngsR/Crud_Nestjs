// Mengimpor Injectable dan Exception dari NestJS
import { Injectable, NotFoundException } from '@nestjs/common';
// Mengimpor InjectRepository
import { InjectRepository } from '@nestjs/typeorm';
// Mengimpor utilitas TypeORM
import { Like, Repository } from 'typeorm';
// Mengimpor DTOs
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
// Mengimpor Entitas
import { Product } from './entities/product.entity';

// Interface untuk hasil paginasi
export interface PaginatedResult<T> {
  data: T[]; // Array data
  meta: {
    // Metadata paginasi
    total: number; // Total data
    page: number; // Halaman saat ini
    limit: number; // Batas per halaman
    totalPages: number; // Total halaman
  };
}

// Service untuk logika bisnis produk
@Injectable()
export class ProductsService {
  // Konstruktor menyuntikkan Repository Produk
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // Membuat produk baru
  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Membuat instance produk dari DTO
    const product = this.productRepository.create(createProductDto);
    // Menyimpan ke database
    return this.productRepository.save(product);
  }

  // Mengambil semua produk dengan filter dan paginasi
  async findAll(queryDto: QueryProductDto): Promise<PaginatedResult<Product>> {
    const {
      page = 1,
      limit = 10,
      category,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      order = 'DESC',
      search,
    } = queryDto;

    // Membuat query builder
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .where('product.isActive = :isActive', { isActive: true }); // Hanya produk aktif

    // Filter pencarian (nama atau deskripsi)
    if (search) {
      queryBuilder.andWhere(
        '(product.name ILIKE :search OR product.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Filter berdasarkan kategori
    if (category) {
      queryBuilder.andWhere('product.categoryId = :category', { category });
    }

    // Filter range harga
    if (minPrice !== undefined && maxPrice !== undefined) {
      queryBuilder.andWhere('product.price BETWEEN :minPrice AND :maxPrice', {
        minPrice,
        maxPrice,
      });
    } else if (minPrice !== undefined) {
      queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
    } else if (maxPrice !== undefined) {
      queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    // Mengatur pengurutan (sorting)
    const orderDirection = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    queryBuilder.orderBy(`product.${sortBy}`, orderDirection);

    // Menerapkan paginasi (skip dan take)
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Mengeksekusi query dan mendapatkan data beserta jumlah total
    const [data, total] = await queryBuilder.getManyAndCount();

    // Mengembalikan hasil dengan format paginasi
    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Pencarian sederhana (mungkin legacy atau khusus search bar tanpa filter lain)
  async search(searchDto: SearchProductDto): Promise<Product[]> {
    const { q } = searchDto;

    // Mencari produk yang nama atau deskripsinya mengandung keyword 'q'
    return this.productRepository.find({
      where: [
        { name: Like(`%${q}%`), isActive: true },
        { description: Like(`%${q}%`), isActive: true },
      ],
    });
  }

  // Mencari satu produk berdasarkan ID
  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    // Jika tidak ditemukan, lempar error 404
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    return product;
  }

  // Update produk
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    // Preload data produk (menggabungkan data lama dan baru)
    const product = await this.productRepository.preload({
      id,
      ...updateProductDto,
    });

    // Jika tidak ditemukan
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    // Simpan perubahan
    return this.productRepository.save(product);
  }

  // Hapus produk (soft delete)
  async remove(id: string): Promise<void> {
    // Menggunakan softDelete bawaan TypeORM
    const result = await this.productRepository.softDelete(id);
    // Jika tidak ada baris yang terpengaruh (berarti ID salah/tidak ada)
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
  }
}
