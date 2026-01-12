// Mengimpor dekorator dan utilitas NestJS
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
  Query,
  UseGuards,
} from '@nestjs/common';
// Mengimpor dekorator Swagger
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
// Mengimpor Guard autentikasi
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// Mengimpor dekorator Roles
import { Roles } from '../auth/roles.decorator';
// Mengimpor Guard otorisasi Roles
import { RolesGuard } from '../auth/roles.guard';
// Mengimpor enum UserRole
import { UserRole } from '../users/entities/user.entity';
// Mengimpor DTO
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
// Mengimpor Service
import { ProductsService } from './products.service';

// Tag Swagger
@ApiTags('Products')
// Controller untuk route 'products'
@Controller('products')
export class ProductsController {
  // Konstruktor menyuntikkan ProductsService
  constructor(private readonly productsService: ProductsService) {}

  // Endpoint membuat produk (hanya ADMIN)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createProductDto: CreateProductDto) {
    // Memanggil service create
    return this.productsService.create(createProductDto);
  }

  // Endpoint mengambil semua produk dengan filter dan paginasi
  @Get()
  @ApiOperation({
    summary: 'Get all products with pagination, filters and search',
  })
  @ApiResponse({ status: 200, description: 'Return paginated products' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'] })
  @ApiQuery({ name: 'search', required: false, type: String })
  findAll(@Query() queryDto: QueryProductDto) {
    // Memanggil service findAll dengan parameter query
    return this.productsService.findAll(queryDto);
  }

  // Endpoint mengambil satu produk berdasarkan ID
  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiResponse({ status: 200, description: 'Return the product' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    // Memanggil service findOne
    return this.productsService.findOne(id);
  }

  // Endpoint update produk (hanya ADMIN)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    // Memanggil service update
    return this.productsService.update(id, updateProductDto);
  }

  // Endpoint hapus produk (soft delete, hanya ADMIN)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a product (soft delete)' })
  @ApiResponse({ status: 204, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    // Memanggil service remove
    return this.productsService.remove(id);
  }
}
