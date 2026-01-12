// Mengimpor Module dari NestJS
import { Module } from '@nestjs/common';
// Mengimpor TypeOrmModule untuk integrasi database
import { TypeOrmModule } from '@nestjs/typeorm';
// Mengimpor CategoriesController
import { CategoriesController } from './categories.controller';
// Mengimpor CategoriesService
import { CategoriesService } from './categories.service';
// Mengimpor entitas Category
import { Category } from './entities/category.entity';

// Mendefinisikan metadata modul Categories
@Module({
  // Mendaftarkan entitas Category ke TypeORM dalam scope modul ini
  imports: [TypeOrmModule.forFeature([Category])],
  // Mendaftarkan controller yang menangani request
  controllers: [CategoriesController],
  // Mendaftarkan service sebagai provider
  providers: [CategoriesService],
  // Mengekspor CategoriesService agar bisa digunakan modul lain (misal ProductsModule)
  exports: [CategoriesService],
})
export class CategoriesModule {}
