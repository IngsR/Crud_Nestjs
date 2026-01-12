// Mengimpor utilitas interception dari NestJS
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
// Mengimpor Observable dan map operator dari RxJS
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Interface untuk standar respon sukses
export interface Response<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
  path: string;
}

// Interceptor untuk mengubah format respon API menjadi seragam
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  // Fungsi intercept memproses respon sebelum dikirim ke client
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    // Mengambil request object untuk mendapatkan URL
    const request = context.switchToHttp().getRequest();

    // handle() memanggil handler route, kemudian pipe() memodifikasi hasilnya
    return next.handle().pipe(
      map((data) => ({
        success: true, // Menandakan request sukses
        data, // Data asli dari controller
        timestamp: new Date().toISOString(), // Waktu respon
        path: request.url, // Path yang diakses
      })),
    );
  }
}
