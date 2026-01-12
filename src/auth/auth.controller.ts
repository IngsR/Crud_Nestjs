// Mengimpor dekorator dan utility yang diperlukan dari @nestjs/common
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
// Mengimpor dekorator Swagger untuk dokumentasi API
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
// Mengimpor DTO untuk pembuatan user
import { CreateUserDto } from '../users/dto/create-user.dto';
// Mengimpor AuthService untuk logika bisnis autentikasi
import { AuthService } from './auth.service';
// Mengimpor LoginDto untuk data login
import { LoginDto } from './dto/login.dto';
// Mengimpor Guard untuk proteksi route dengan JWT
import { JwtAuthGuard } from './jwt-auth.guard';
// Mengimpor Guard untuk autentikasi lokal
import { LocalAuthGuard } from './local-auth.guard';

// Menambahkan tag 'auth' untuk pengelompokan di Swagger UI
@ApiTags('auth')
// Mendefinisikan controller dengan prefix route 'auth'
@Controller('auth')
export class AuthController {
  // Injeksi AuthService melalui constructor
  constructor(private readonly authService: AuthService) {}

  // Menerapkan Guard LocalStrategy untuk memvalidasi kredensial login
  @UseGuards(LocalAuthGuard)
  // Mendefinisikan endpoint POST /auth/login
  @Post('login')
  // Fungsi handler untuk login
  async login(@Body() loginDto: LoginDto) {
    // Memanggil method login di AuthService dan mengembalikan token
    return this.authService.login(loginDto);
  }

  // Mendefinisikan endpoint POST /auth/register
  @Post('register')
  // Fungsi handler untuk registrasi user baru
  async register(@Body() createUserDto: CreateUserDto) {
    // Memanggil method register di AuthService untuk membuat user
    return this.authService.register(createUserDto);
  }

  // Menandakan endpoint ini membutuhkan autentikasi Bearer token di Swagger
  @ApiBearerAuth()
  // Menerapkan Guard JwtStrategy untuk memvalidasi token JWT
  @UseGuards(JwtAuthGuard)
  // Mendefinisikan endpoint GET /auth/profile
  @Get('profile')
  // Fungsi handler untuk mendapatkan profil user yang sedang login
  getProfile(@Request() req) {
    // Mengembalikan data user yang ditempelkan oleh Guard ke request object
    return req.user;
  }
}
