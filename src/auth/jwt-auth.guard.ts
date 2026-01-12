// Mengimpor Injectable dari NestJS common
import { Injectable } from '@nestjs/common';
// Mengimpor AuthGuard dari modul passport
import { AuthGuard } from '@nestjs/passport';

// Menandai kelas ini sebagai provider
@Injectable()
// Membuat Guard kustom yang memperluas AuthGuard dengan strategi 'jwt'
// Ini digunakan untuk memproteksi route agar hanya bisa diakses dengan token JWT yang valid
export class JwtAuthGuard extends AuthGuard('jwt') {}
