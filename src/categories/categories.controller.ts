// Mengimpor dekorator dan utilitas dari NestJS
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
// Mengimpor dekorator Swagger untuk dokumentasi API
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
// Mengimpor Guard autentikasi JWT
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// Mengimpor dekorator Roles
import { Roles } from '../auth/roles.decorator';
// Mengimpor Guard otorisasi Roles
import { RolesGuard } from '../auth/roles.guard';
// Mengimpor enum UserRole
import { UserRole } from '../users/entities/user.entity';
// Mengimpor CategoriesService
import { CategoriesService } from './categories.service';
// Mengimpor DTO CreateCategoryDto
import { CreateCategoryDto } from './dto/create-category.dto';
// Mengimpor DTO UpdateCategoryDto
import { UpdateCategoryDto } from './dto/update-category.dto';

// Menambahkan tag 'Categories' untuk Swagger
@ApiTags('Categories')
// Mendefinisikan controller dengan prefix 'categories'
@Controller('categories')
export class CategoriesController {
  // Menyuntikkan CategoriesService via constructor
  constructor(private readonly categoriesService: CategoriesService) {}

  // Menandakan endpoint ini butuh autentikasi Bearer token
  @ApiBearerAuth()
  // Menggunakan JwtAuthGuard dan RolesGuard
  @UseGuards(JwtAuthGuard, RolesGuard)
  // Membatasi akses hanya untuk role ADMIN
  @Roles(UserRole.ADMIN)
  // Endpoint POST /categories untuk membaut kategori baru
  @Post()
  // Dokumentasi operasi Swagger
  @ApiOperation({ summary: 'Create a new category' })
  // Dokumentasi respons sukses (201 Created)
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  // Dokumentasi respons error (400 Bad Request)
  @ApiResponse({ status: 400, description: 'Bad request' })
  // Dokumentasi respons error (409 Conflict)
  @ApiResponse({ status: 409, description: 'Category already exists' })
  // Fungsi handler create category
  create(@Body() createCategoryDto: CreateCategoryDto) {
    // Memanggil service untuk membuat kategori
    return this.categoriesService.create(createCategoryDto);
  }

  // Endpoint GET /categories untuk mengambil semua kategori
  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'Return all categories' })
  // Fungsi handler get all categories
  findAll() {
    // Memanggil service untuk mengambil semua kategori
    return this.categoriesService.findAll();
  }

  // Endpoint GET /categories/:id untuk mengambil kategori berdasarkan ID
  @Get(':id')
  @ApiOperation({ summary: 'Get a category by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the category with products',
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  // Fungsi handler get category by id dengan validasi UUID
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    // Memanggil service get by id
    return this.categoriesService.findOne(id);
  }

  // Endpoint PATCH /categories/:id untuk update kategori (hanya ADMIN)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a category' })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  // Fungsi handler update category
  update(
    @Param('id', ParseUUIDPipe) id: string, // Mengambil ID dari URL
    @Body() updateCategoryDto: UpdateCategoryDto, // Mengambil data update dari body
  ) {
    // Memanggil service update
    return this.categoriesService.update(id, updateCategoryDto);
  }

  // Endpoint DELETE /categories/:id untuk soft delete kategori (hanya ADMIN)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  // Mengatur status code response menjadi 204 No Content
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a category (soft delete)' })
  @ApiResponse({ status: 204, description: 'Category deleted successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  // Fungsi handler delete category
  remove(@Param('id', ParseUUIDPipe) id: string) {
    // Memanggil service remove
    return this.categoriesService.remove(id);
  }
}
