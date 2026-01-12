// Mengimpor Module dan ValidationPipe
import { Module, ValidationPipe } from '@nestjs/common';
// Mengimpor ConfigModule untuk env vars
import { ConfigModule, ConfigService } from '@nestjs/config';
// Mengimpor konstanta provider global (Interceptor, Filter, Pipe)
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
// Mengimpor ServeStaticModule untuk menyajikan file statis (public folder)
import { ServeStaticModule } from '@nestjs/serve-static';
// Mengimpor ThrottlerModule untuk rate limiting
import { ThrottlerModule } from '@nestjs/throttler';
// Mengimpor TypeOrmModule untuk database
import { TypeOrmModule } from '@nestjs/typeorm';
// Mengimpor join untuk path
import { join } from 'path';
// Mengimpor Controller dan Service utama
import { AppController } from './app.controller';
import { AppService } from './app.service';
// Mengimpor Modul Fitur
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { FilesModule } from './files/files.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';

// Definisi Module Utama Aplikasi
@Module({
  imports: [
    // Konfigurasi ConfigModule (Global)
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Konfigurasi Database TypeORM (PostgreSQL)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres', // Menggunakan PostgreSQL
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_DATABASE', 'crud_db'),
        autoLoadEntities: true, // Otomatis memuat entitas
        synchronize: true, // Sinkronisasi schema (Set false di production!)
      }),
    }),
    // Konfigurasi Throttler (Rate Limiting)
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 detik
        limit: 10, // Maksimal 10 request per menit
      },
    ]),
    // Modul-modul fitur aplikasi
    ProductsModule,
    CategoriesModule,
    UsersModule,
    AuthModule,
    FilesModule,
    // Menyajikan file statis dari folder public
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api*'], // Jangan sajikan untuk route /api
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Mendaftarkan ValidationPipe secara global
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true, // Hapus properti yang tidak ada di DTO
        forbidNonWhitelisted: true, // Error jika ada properti berlebih
        transform: true, // Otomatis transformasi tipe data
      }),
    },
    // Mendaftarkan Exception Filter Global
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    // Mendaftarkan Interceptor Transform Global
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
