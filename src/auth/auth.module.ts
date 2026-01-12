// Mengimpor dekorator Module untuk mendefinisikan modul NestJS
import { Module } from '@nestjs/common';
// Mengimpor ConfigModule dan ConfigService untuk manajemen konfigurasi
import { ConfigModule, ConfigService } from '@nestjs/config';
// Mengimpor JwtModule untuk fungsionalitas JWT
import { JwtModule } from '@nestjs/jwt';
// Mengimpor PassportModule untuk integrasi strategi autentikasi
import { PassportModule } from '@nestjs/passport';
// Mengimpor UsersModule agar AuthModule bisa mengakses layanan user
import { UsersModule } from '../users/users.module';
// Mengimpor AuthController
import { AuthController } from './auth.controller';
// Mengimpor AuthService
import { AuthService } from './auth.service';
// Mengimpor strategi JWT
import { JwtStrategy } from './jwt.strategy';
// Mengimpor strategi lokal (username/password)
import { LocalStrategy } from './local.strategy';

// Dekorator @Module mendefinisikan metadata modul
@Module({
  // Daftar modul yang diimpor
  imports: [
    UsersModule, // Mengimpor UsersModule
    PassportModule, // Mengimpor PassportModule
    // Mengonfigurasi JwtModule secara asinkron
    JwtModule.registerAsync({
      imports: [ConfigModule], // Mengimpor ConfigModule untuk akses env vars
      inject: [ConfigService], // Menyuntikkan ConfigService
      // Factory function untuk menghasilkan opsi konfigurasi JWT
      useFactory: async (configService: ConfigService) => ({
        // Mengambil secret key dari environment variable atau default 'secretKey'
        secret: configService.get<string>('JWT_SECRET') || 'secretKey',
        // Mengatur opsi penandatanganan token, misalnya kedaluwarsa dalam 60 menit
        signOptions: { expiresIn: '60m' },
      }),
    }),
  ],
  // Controller yang diatur oleh modul ini
  controllers: [AuthController],
  // Provider yang tersedia dalam modul ini (Service dan Strategy)
  providers: [AuthService, LocalStrategy, JwtStrategy],
  // Mengekspor AuthService agar bisa digunakan oleh modul lain
  exports: [AuthService],
})
export class AuthModule {}
