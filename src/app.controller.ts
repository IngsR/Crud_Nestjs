// Mengimpor Controller dan Get dari NestJS
import { Controller, Get } from '@nestjs/common';
// Mengimpor AppService
import { AppService } from './app.service';

// Controller utama aplikasi
@Controller()
export class AppController {
  // Konstruktor menyuntikkan AppService
  constructor(private readonly appService: AppService) {}

  // Endpoint root (/)
  @Get()
  getHello(): string {
    // Memanggil service untuk mendapatkan pesan Hello
    return this.appService.getHello();
  }
}
