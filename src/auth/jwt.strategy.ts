// Mengimpor Injectable untuk dependency injection
import { Injectable } from '@nestjs/common';
// Mengimpor ConfigService untuk mengakses konfigurasi environment
import { ConfigService } from '@nestjs/config';
// Mengimpor PassportStrategy untuk membuat strategi autentikasi kustom
import { PassportStrategy } from '@nestjs/passport';
// Mengimpor ExtractJwt dan Strategy dari passport-jwt
import { ExtractJwt, Strategy } from 'passport-jwt';

// Menandai kelas ini sebagai provider NestJS
@Injectable()
// Mendefinisikan strategi JWT yang mewarisi PassportStrategy
export class JwtStrategy extends PassportStrategy(Strategy) {
  // Konstruktor menerima ConfigService
  constructor(configService: ConfigService) {
    // Memanggil konstruktor parent dengan opsi konfigurasi
    super({
      // Mengambil token JWT dari header Authorization sebagai Bearer token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Tidak mengabaikan waktu kedaluwarsa token (token expired akan ditolak)
      ignoreExpiration: false,
      // Menggunakan secret key dari environment variable atau default 'secretKey'
      secretOrKey: configService.get<string>('JWT_SECRET') || 'secretKey',
    });
  }

  // Fungsi validasi yang dipanggil setelah token berhasil diverifikasi
  async validate(payload: any) {
    // Mengembalikan objek user yang akan ditempelkan ke request object (req.user)
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
