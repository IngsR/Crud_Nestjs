import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

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

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .where('product.isActive = :isActive', { isActive: true });

    if (search) {
      queryBuilder.andWhere(
        '(product.name ILIKE :search OR product.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Filter by categoryId (UUID)
    if (category) {
      queryBuilder.andWhere('product.categoryId = :category', { category });
    }

    // Filter by price range
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

    // Apply sorting
    const orderDirection = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    queryBuilder.orderBy(`product.${sortBy}`, orderDirection);

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

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

  async search(searchDto: SearchProductDto): Promise<Product[]> {
    const { q } = searchDto;

    return this.productRepository.find({
      where: [
        { name: Like(`%${q}%`), isActive: true },
        { description: Like(`%${q}%`), isActive: true },
      ],
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productRepository.preload({
      id,
      ...updateProductDto,
    });

    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    return this.productRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const result = await this.productRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
  }
}
