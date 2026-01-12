// Mengimpor interface dan decorator error handling dari NestJS
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
// Mengimpor Response dari Express
import { Response } from 'express';

// Menangkap semua exception (error)
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  // Fungsi catch dipanggil ketika exception terlempar
  catch(exception: unknown, host: ArgumentsHost) {
    // Mengambil context HTTP
    const ctx = host.switchToHttp();
    // Mengambil objek response express
    const response = ctx.getResponse<Response>();
    // Mengambil objek request
    const request = ctx.getRequest();

    // Menentukan status code HTTP
    const status =
      exception instanceof HttpException
        ? exception.getStatus() // Jika exception HTTP, gunakan statusnya
        : HttpStatus.INTERNAL_SERVER_ERROR; // Default 500 Internal Server Error

    // Menentukan pesan error
    const message =
      exception instanceof HttpException
        ? exception.getResponse() // Mengambil respon dari exception
        : 'Internal server error'; // Pesan default

    // Membentuk respon error yang terstandar
    const errorResponse = {
      success: false, // Menandakan request gagal
      statusCode: status,
      timestamp: new Date().toISOString(), // Waktu kejadian
      path: request.url, // URL yang diakses
      message:
        typeof message === 'string'
          ? message
          : (message as any).message || 'An error occurred',
      // Jika pesan berupa object, sertakan detailnya
      ...(typeof message === 'object' && message !== null
        ? { details: message }
        : {}),
    };

    // Mengirimkan respon ke client
    response.status(status).json(errorResponse);
  }
}
