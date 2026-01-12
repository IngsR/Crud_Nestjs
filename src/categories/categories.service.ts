// Mengimpor Exception dan Injectable dari NestJS
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
// Mengimpor InjectRepository untuk menyuntikkan repository TypeORM
import { InjectRepository } from '@nestjs/typeorm';
// Mengimpor Repository class dari TypeORM
import { Repository } from 'typeorm';
// Mengimpor DTO CreateCategoryDto
import { CreateCategoryDto } from './dto/create-category.dto';
// Mengimpor DTO UpdateCategoryDto
import { UpdateCategoryDto } from './dto/update-category.dto';
// Mengimpor entitas Category
import { Category } from './entities/category.entity';

// Menandai kelas ini sebagai Service yang bisa diinjeksi
@Injectable()
export class CategoriesService {
  // Konstruktor untuk menyuntikkan CategoryRepository
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // Fungsi untuk membuat kategori baru
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    // Memeriksa apakah kategori dengan nama yang sama sudah ada
    const existingCategory = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name },
    });

    // Jika sudah ada, lempar error Conflict (409)
    if (existingCategory) {
      throw new ConflictException(
        `Category with name "${createCategoryDto.name}" already exists`,
      );
    }

    // Membuat instance kategori baru dari DTO
    const category = this.categoryRepository.create(createCategoryDto);
    // Menyimpan kategori ke database
    return this.categoryRepository.save(category);
  }

  // Fungsi untuk mengambil semua kategori yang aktif
  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { isActive: true }, // Hanya ambil yang aktif
      order: { name: 'ASC' }, // Urutkan berdasarkan nama (A-Z)
    });
  }

  // Fungsi untuk mengambil satu kategori berdasarkan ID
  async findOne(id: string): Promise<Category> {
    // Mencari kategori berdasarkan ID dan memuat relasi products
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    // Jika kategori tidak ditemukan, lempar error NotFound (404)
    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }

    // Mengembalikan data kategori
    return category;
  }

  // Fungsi untuk memperbarui kategori
  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    // Memuat ulang kategori dengan data baru (preload menggabungkan data lama dan baru)
    const category = await this.categoryRepository.preload({
      id,
      ...updateCategoryDto,
    });

    // Jika kategori tidak ditemukan, lempar error NotFound
    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }

    // Menyimpan perubahan ke database
    return this.categoryRepository.save(category);
  }

  // Fungsi untuk menghapus kategori (soft delete)
  async remove(id: string): Promise<void> {
    // Memastikan kategori ada sebelum dihapus
    const category = await this.findOne(id);

    // Menandai kategori sebagai non-aktif (soft delete manual jika diinginkan, atau gunakan softRemove)
    // Di sini kita set isActive = false seperti yang diminta logika bisnis
    category.isActive = false;
    // Menyimpan perubahan status
    await this.categoryRepository.save(category);
  }
}
