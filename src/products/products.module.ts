// Mengimpor Module dari NestJS
import { Module } from '@nestjs/common';
// Mengimpor TypeOrmModule untuk integrasi database
import { TypeOrmModule } from '@nestjs/typeorm';
// Mengimpor Entitas Product
import { Product } from './entities/product.entity';
// Mengimpor ProductsController
import { ProductsController } from './products.controller';
// Mengimpor ProductsService
import { ProductsService } from './products.service';

// Definisi Modul Products
@Module({
  // Mendaftarkan entitas Product ke TypeORM
  imports: [TypeOrmModule.forFeature([Product])],
  // Mendaftarkan Controller
  controllers: [ProductsController],
  // Mendaftarkan Service sebagai Provider
  providers: [ProductsService],
  // Mengekspor Service agar bisa digunakan di modul lain (misal untuk Seeding)
  exports: [ProductsService],
})
export class ProductsModule {}
