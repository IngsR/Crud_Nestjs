// Mengimpor dekorator Injectable dan Exception dari NestJS
import { Injectable, UnauthorizedException } from '@nestjs/common';
// Mengimpor JwtService untuk pembuatan token
import { JwtService } from '@nestjs/jwt';
// Mengimpor bcrypt untuk hashing password
import * as bcrypt from 'bcrypt';
// Mengimpor DTO pembuatan user
import { CreateUserDto } from '../users/dto/create-user.dto';
// Mengimpor UsersService untuk interaksi dengan data user
import { UsersService } from '../users/users.service';
// Mengimpor DTO login
import { LoginDto } from './dto/login.dto';

// Menandai kelas ini sebagai provider yang bisa diinjeksi
@Injectable()
export class AuthService {
  // Konstruktor untuk menyuntikkan dependensi UsersService dan JwtService
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Validasi user berdasarkan email dan password
  async validateUser(email: string, pass: string): Promise<any> {
    // Mencari user berdasarkan email
    const user = await this.usersService.findOne(email);
    // Jika user ditemukan dan password cocok (menggunakan bcrypt compare)
    if (user && user.password && (await bcrypt.compare(pass, user.password))) {
      // Memisahkan password dari objek user untuk keamanan
      const { password, ...result } = user;
      // Mengembalikan data user tanpa password
      return result;
    }
    // Mengembalikan null jika validasi gagal
    return null;
  }

  // Fungsi untuk menangani proses login
  async login(loginDto: LoginDto) {
    // Memvalidasi kredensial user
    const user = await this.validateUser(loginDto.email, loginDto.password);
    // Jika user tidak valid, lempar error Unauthorized
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Membuat payload untuk token JWT (termasuk email, id, dan role)
    const payload = { email: user.email, sub: user.id, role: user.role };
    // Mengembalikan access token yang sudah ditandatangani
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // Fungsi untuk menangani registrasi user baru
  async register(createUserDto: CreateUserDto) {
    // Membuat user baru menggunakan UsersService
    const user = await this.usersService.create(createUserDto);
    // Memisahkan password dari hasil pembuatan user
    const { password, ...result } = user;
    // Mengembalikan data user baru tanpa password
    return result;
  }
}
