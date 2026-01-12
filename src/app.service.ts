// Mengimpor Injectable
import { Injectable } from '@nestjs/common';

// Service utama aplikasi
@Injectable()
export class AppService {
  // Fungsi mengembalikan string 'Hello World!'
  getHello(): string {
    return 'Hello World!';
  }
}
