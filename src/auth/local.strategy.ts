// Mengimpor Injectable dan Exception dari NestJS
import { Injectable, UnauthorizedException } from '@nestjs/common';
// Mengimpor PassportStrategy base class
import { PassportStrategy } from '@nestjs/passport';
// Mengimpor Strategy lokal dari passport-local
import { Strategy } from 'passport-local';
// Mengimpor AuthService untuk memvalidasi user
import { AuthService } from './auth.service';

// Menandai kelas sebagai provider yang bisa diinjeksi
@Injectable()
// Mendefinisikan strategi lokal yang mewarisi PassportStrategy
export class LocalStrategy extends PassportStrategy(Strategy) {
  // Konstruktor menerima AuthService
  constructor(private authService: AuthService) {
    // Memanggil super dengan konfigurasi usernameField menggunakan 'email'
    super({ usernameField: 'email' });
  }

  // Metode validate dipanggil otomatis oleh Passport saat strategi digunakan
  async validate(email: string, pass: string): Promise<any> {
    // Memvalidasi user menggunakan AuthService
    const user = await this.authService.validateUser(email, pass);
    // Jika user tidak ditemukan, lempar exception Unauthorized
    if (!user) {
      throw new UnauthorizedException();
    }
    // Mengembalikan user jika validasi berhasil
    return user;
  }
}
