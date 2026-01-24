// Mengimpor NestFactory untuk inisialisasi aplikasi
import { NestFactory } from '@nestjs/core';
// Mengimpor Swagger untuk dokumentasi API
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// Mengimpor AppModule
import { AppModule } from './app.module';

// Fungsi bootstrap untuk menjalankan aplikasi
async function bootstrap() {
  // Membuat instance aplikasi NestJS
  const app = await NestFactory.create(AppModule);

  // Mengaktifkan CORS (Cross-Origin Resource Sharing)
  app.enableCors();

  // Mengatur prefix global '/api' untuk semua route
  app.setGlobalPrefix('api');

  // Konfigurasi Swagger
  const config = new DocumentBuilder()
    .setTitle('CRUD API') // Judul dokumentasi
    .setDescription('NestJS CRUD Application API Documentation') // Deskripsi
    .setVersion('1.0') // Versi API
    .addTag('Products', 'Product management endpoints') // Tag Produk
    .addTag('Categories', 'Category management endpoints') // Tag Kategori
    .addBearerAuth() // Menambahkan opsi autentikasi Bearer Token
    .build();

  // Membuat dokumen Swagger
  const document = SwaggerModule.createDocument(app, config);
  // Menyajikan UI Swagger di endpoint '/api/docs'
  SwaggerModule.setup('api/docs', app, document);

  // Menjalankan server pada port dari env atau default 3000
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  console.log(
    `Application is running on: http://localhost:${process.env.PORT ?? 3000}`,
  );
  console.log(
    `Swagger documentation: http://localhost:${process.env.PORT ?? 3000}/api/docs`,
  );
}
// Memanggil fungsi bootstrap
bootstrap();
