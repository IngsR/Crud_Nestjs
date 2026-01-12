// Mengimpor Injectable dari NestJS common
import { Injectable } from '@nestjs/common';
// Mengimpor AuthGuard dari modul passport
import { AuthGuard } from '@nestjs/passport';

// Menandai kelas ini sebagai provider
@Injectable()
// Membuat Guard kustom yang memperluas AuthGuard dengan strategi 'local'
// Ini digunakan pada endpoint login untuk memicu validasi username/password
export class LocalAuthGuard extends AuthGuard('local') {}
