# NestJS CRUD API

> REST API enterprise-grade dengan NestJS, TypeORM, PostgreSQL yang dilengkapi dengan pagination, filtering, soft delete, dan dokumentasi Swagger

## 📋 Daftar Isi

- [Arsitektur](#-arsitektur)
- [Tech Stack](#-tech-stack)
- [Fitur Utama](#-fitur-utama)
- [Prasyarat](#-prasyarat)
- [Instalasi](#-instalasi)
- [Konfigurasi](#-konfigurasi)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [Docker Deployment](#-docker-deployment)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Endpoint Reference](#-endpoint-reference)
- [Testing](#-testing)
- [Project Structure](#-project-structure)
- [Best Practices](#-best-practices)

## 🏗️ Arsitektur

Aplikasi ini menggunakan **Modular Monolithic Architecture** dengan pattern layering yang jelas:

```
├── Presentation Layer (Controllers)
├── Business Logic Layer (Services)
├── Data Access Layer (Repositories/TypeORM)
└── Database Layer (PostgreSQL)
```

### Design Patterns

- **Repository Pattern** - Abstraksi akses data via TypeORM
- **DTO Pattern** - Data Transfer Objects dengan class-validator
- **Dependency Injection** - Native NestJS IoC container
- **Interceptor Pattern** - Response transformation & logging
- **Exception Filter Pattern** - Centralized error handling

## 🛠️ Tech Stack

| Layer             | Technology        | Version |
| ----------------- | ----------------- | ------- |
| **Runtime**       | Node.js           | v18+    |
| **Framework**     | NestJS            | ^11.0   |
| **Language**      | TypeScript        | ^5.7    |
| **ORM**           | TypeORM           | ^0.3.27 |
| **Database**      | PostgreSQL        | 14+     |
| **Validation**    | class-validator   | ^0.14   |
| **Documentation** | Swagger/OpenAPI   | ^3.0    |
| **Rate Limiting** | @nestjs/throttler | ^6.0    |

## ⚡ Fitur Utama

### Core Features

- ✅ **CRUD Operations** - Create, Read, Update, Delete untuk Products & Categories
- ✅ **Pagination** - Server-side pagination dengan metadata (total, pages, limit)
- ✅ **Filtering** - Multi-criteria filtering (category, price range)
- ✅ **Sorting** - Dynamic sorting (field, order)
- ✅ **Search** - Full-text search di name & description
- ✅ **Soft Delete** - Logical delete dengan `isActive` flag

### Advanced Features

- ✅ **Entity Relations** - ManyToOne/OneToMany antara Products & Categories
- ✅ **Global Validation** - Automatic DTO validation dengan class-validator
- ✅ **Exception Handling** - Standardized error responses
- ✅ **Response Transformation** - Consistent API response wrapper
- ✅ **Rate Limiting** - Protection dari abuse (10 req/60s)
- ✅ **Swagger UI** - Interactive API documentation
- ✅ **Database Seeder** - Sample data untuk development

### Security & Performance

- ✅ **Input Validation** - XSS & SQL Injection prevention via validation pipes
- ✅ **Type Safety** - Strong typing dengan TypeScript
- ✅ **CORS** - Configurable cross-origin resource sharing
- ✅ **Environment Variables** - Secure configuration management
- ✅ **Query Optimization** - Efficient database queries dengan QueryBuilder

## 📦 Prasyarat

Pastikan sistem Anda telah terinstall:

```bash
node >= 18.x
npm >= 9.x
postgresql >= 14.x
```

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone <repository-url>
cd crud-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database

Buat database PostgreSQL:

```sql
CREATE DATABASE crud_db;
```

## ⚙️ Konfigurasi

### Environment Variables

Copy `.env.example` ke `.env`:

```bash
cp .env.example .env
```

Edit `.env` dengan konfigurasi Anda:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_secure_password
DB_DATABASE=crud_db

# Application Configuration
PORT=3000
```

### TypeORM Configuration

TypeORM dikonfigurasi di `src/app.module.ts` dengan opsi:

- `autoLoadEntities: true` - Auto-load semua entities
- `synchronize: true` - Auto-sync schema (⚠️ disable di production!)
- `logging: false` - SQL query logging

**⚠️ Production Note:** Set `synchronize: false` dan gunakan migrations!

## 🎯 Menjalankan Aplikasi

### Development Mode

```bash
# Watch mode dengan hot reload
npm run start:dev

# Debug mode
npm run start:debug
```

Server akan berjalan di `http://localhost:3000`

### Production Mode

```bash
# Build aplikasi
npm run build

# Run production build
npm run start:prod
```

### Database Seeding

Populate database dengan sample data:

```bash
npm run seed
```

Akan membuat:

- 5 Categories (Electronics, Clothing, Books, Home & Garden, Sports)
- 12 Products dengan data realistis

## 🐳 Docker Deployment

### Build Docker Image

```bash
docker build -t nestjs-crud-app .
```

### Run dengan Docker Compose

```bash
docker-compose up -d
```

Services yang di-deploy:

- **API Server** - Port 3000
- **PostgreSQL** - Port 5432

### Environment Variables di Docker

Edit `docker-compose.yml` untuk production configuration.

## 📚 API Documentation

### Swagger UI

Akses interactive API documentation:

```
http://localhost:3000/api/docs
```

### Base URL

```
http://localhost:3000/api
```

### Response Format

**Success Response:**

```json
{
  "success": true,
  "data": {
    /* response payload */
  },
  "timestamp": "2025-12-02T15:00:00.000Z",
  "path": "/api/products"
}
```

**Error Response:**

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Product with ID \"xyz\" not found",
  "timestamp": "2025-12-02T15:00:00.000Z",
  "path": "/api/products/xyz"
}
```

## 🗄️ Database Schema

### Products Table

| Column      | Type          | Constraints      | Description             |
| ----------- | ------------- | ---------------- | ----------------------- |
| id          | UUID          | PRIMARY KEY      | Product identifier      |
| name        | VARCHAR       | UNIQUE, NOT NULL | Product name            |
| description | TEXT          | NULLABLE         | Product description     |
| price       | DECIMAL(10,2) | NOT NULL         | Product price           |
| stock       | INTEGER       | DEFAULT 0        | Stock quantity          |
| categoryId  | UUID          | FOREIGN KEY      | Reference to categories |
| isActive    | BOOLEAN       | DEFAULT true     | Soft delete flag        |
| createdAt   | TIMESTAMP     | AUTO             | Creation timestamp      |
| updatedAt   | TIMESTAMP     | AUTO             | Last update timestamp   |

### Categories Table

| Column      | Type      | Constraints      | Description           |
| ----------- | --------- | ---------------- | --------------------- |
| id          | UUID      | PRIMARY KEY      | Category identifier   |
| name        | VARCHAR   | UNIQUE, NOT NULL | Category name         |
| description | TEXT      | NULLABLE         | Category description  |
| isActive    | BOOLEAN   | DEFAULT true     | Soft delete flag      |
| createdAt   | TIMESTAMP | AUTO             | Creation timestamp    |
| updatedAt   | TIMESTAMP | AUTO             | Last update timestamp |

### Relations

```
Categories (1) ←→ (N) Products
```

## 🔗 Endpoint Reference

### Products API

#### Create Product

```http
POST /api/products
Content-Type: application/json

{
  "name": "Laptop Pro",
  "description": "High-performance laptop",
  "price": 1299.99,
  "stock": 25,
  "categoryId": "uuid-here"
}
```

#### List Products (Paginated)

```http
GET /api/products?page=1&limit=10&category=uuid&minPrice=100&maxPrice=1000&sortBy=price&order=ASC
```

**Query Parameters:**

- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 10, max: 100)
- `category` (UUID) - Filter by category ID
- `minPrice` (number) - Minimum price filter
- `maxPrice` (number) - Maximum price filter
- `sortBy` (string) - Sort field (default: createdAt)
- `order` (ASC|DESC) - Sort order (default: DESC)

#### Search Products

```http
GET /api/products/search/query?q=laptop
```

#### Get Single Product

```http
GET /api/products/:id
```

#### Update Product

```http
PATCH /api/products/:id
Content-Type: application/json

{
  "price": 999.99,
  "stock": 30
}
```

#### Delete Product (Soft Delete)

```http
DELETE /api/products/:id
```

Returns: `204 No Content`

### Categories API

#### Create Category

```http
POST /api/categories
Content-Type: application/json

{
  "name": "Electronics",
  "description": "Electronic devices and gadgets"
}
```

#### List Categories

```http
GET /api/categories
```

#### Get Category with Products

```http
GET /api/categories/:id
```

#### Update Category

```http
PATCH /api/categories/:id
Content-Type: application/json

{
  "description": "Updated description"
}
```

#### Delete Category

```http
DELETE /api/categories/:id
```

## 🧪 Testing

### Run Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Manual Testing via Swagger

1. Buka `http://localhost:3000/api/docs`
2. Klik endpoint yang ingin ditest
3. Klik "Try it out"
4. Isi request body/parameters
5. Klik "Execute"

## 📁 Project Structure

```
src/
├── common/                      # Shared utilities
│   ├── dto/
│   │   └── pagination.dto.ts    # Reusable pagination DTO
│   ├── filters/
│   │   └── http-exception.filter.ts  # Global error handler
│   └── interceptors/
│       └── transform.interceptor.ts  # Response wrapper
├── products/                    # Products module
│   ├── dto/
│   │   ├── create-product.dto.ts
│   │   ├── update-product.dto.ts
│   │   ├── query-product.dto.ts
│   │   └── search-product.dto.ts
│   ├── entities/
│   │   └── product.entity.ts
│   ├── products.controller.ts
│   ├── products.service.ts
│   └── products.module.ts
├── categories/                  # Categories module
│   ├── dto/
│   ├── entities/
│   ├── categories.controller.ts
│   ├── categories.service.ts
│   └── categories.module.ts
├── database/
│   └── seeds/
│       └── seeder.ts           # Database seeder
├── app.module.ts               # Root module
└── main.ts                     # Application entry point
```

## 💡 Best Practices

### 1. DTOs (Data Transfer Objects)

Selalu gunakan DTOs dengan validasi untuk input:

```typescript
export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;
}
```

### 2. Exception Handling

Throw built-in NestJS exceptions:

```typescript
throw new NotFoundException(`Product with ID "${id}" not found`);
```

### 3. Async Operations

Gunakan async/await untuk database operations:

```typescript
async findOne(id: string): Promise<Product> {
  const product = await this.productRepository.findOne({ where: { id } });
  if (!product) {
    throw new NotFoundException(`Product with ID "${id}" not found`);
  }
  return product;
}
```

### 4. TypeORM Query Builder

Untuk complex queries, gunakan QueryBuilder:

```typescript
const queryBuilder = this.productRepository
  .createQueryBuilder('product')
  .where('product.isActive = :isActive', { isActive: true })
  .andWhere('product.price BETWEEN :min AND :max', { min, max })
  .orderBy('product.price', 'ASC');
```

### 5. Environment Configuration

Jangan hardcode values, gunakan ConfigService:

```typescript
constructor(private configService: ConfigService) {
  const dbHost = this.configService.get<string>('DB_HOST');
}
```

## 🔧 Troubleshooting

### Database Connection Error

```
Error: password authentication failed for user "postgres"
```

**Solution:** Periksa credentials di `.env` file

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:** Ganti PORT di `.env` atau kill process di port 3000

### TypeORM Synchronize Warning

```
WARNING: Synchronize enabled in production
```

**Solution:** Set `synchronize: false` dan gunakan migrations untuk production

## 📄 License

MIT License

## 👨‍💻 Author

Developed with ❤️ using NestJS

---

**Pro Tips:**

- Gunakan `npm run start:dev` untuk development dengan hot reload
- Akses Swagger UI untuk interactive API testing
- Run `npm run seed` untuk quick setup dengan sample data
- Monitor logs untuk debugging dan performance analysis
- Implement caching (Redis) untuk high-traffic endpoints
- Add comprehensive logging untuk production monitoring
