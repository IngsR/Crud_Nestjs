// Mengimpor Module dari NestJS
import { Module } from '@nestjs/common';
// Mengimpor FilesController
import { FilesController } from './files.controller';
// Mengimpor FilesService
import { FilesService } from './files.service';

// Definisi modul Files
@Module({
  // Mendaftarkan service
  providers: [FilesService],
  // Mendaftarkan controller
  controllers: [FilesController],
})
export class FilesModule {}
