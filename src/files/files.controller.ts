// Mengimpor dekorator dan utilitas dari NestJS
import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
// Mengimpor FileInterceptor untuk menangani upload file
import { FileInterceptor } from '@nestjs/platform-express';
// Mengimpor dekorator Swagger
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
// Mengimpor tipe Response dari Express
import type { Response } from 'express';
// Mengimpor join dari path module
import { join } from 'path';
// Mengimpor FilesService
import { FilesService } from './files.service';
// Mengimpor konfigurasi Multer
import { multerConfig } from './multer.config';

// Tag Swagger untuk endpoints files
@ApiTags('files')
// Controller untuk route 'files'
@Controller('files')
export class FilesController {
  // Konstruktor menyuntikkan FilesService
  constructor(private readonly filesService: FilesService) {}

  // Endpoint POST /files/upload untuk mengupload file
  @Post('upload')
  // Menentukan tipe konten multipart/form-data di Swagger
  @ApiConsumes('multipart/form-data')
  // Dokumentasi body request untuk upload file di Swagger
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  // Menggunakan interceptor untuk menangani upload single file dengan konfigurasi multer
  @UseInterceptors(FileInterceptor('file', multerConfig))
  // Handler untuk upload file
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    // Mengembalikan nama file dan path aksesnya
    return {
      filename: file.filename,
      path: `/files/${file.filename}`,
    };
  }

  // Endpoint GET /files/:filename untuk menyajikan file statis
  @Get(':filename')
  // Handler untuk download/view file
  serveFile(@Param('filename') filename: string, @Res() res: Response) {
    // Mengirimkan file dari folder uploads ke client
    res.sendFile(join(process.cwd(), 'uploads', filename));
  }
}
