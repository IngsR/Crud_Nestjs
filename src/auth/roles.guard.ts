// Mengimpor dependensi yang dibutuhkan dari NestJS
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// Mengimpor Reflector untuk mengakses metadata custom
import { Reflector } from '@nestjs/core';
// Mengimpor enum UserRole
import { UserRole } from '../users/entities/user.entity';
// Mengimpor konstanta ROLES_KEY
import { ROLES_KEY } from './roles.decorator';

// Guard yang bertanggung jawab memverifikasi role user
@Injectable()
export class RolesGuard implements CanActivate {
  // Menyuntikkan Reflector
  constructor(private reflector: Reflector) {}

  // Fungsi utama guard untuk menentukan izin akses
  canActivate(context: ExecutionContext): boolean {
    // Mengambil metadata 'roles' dari handler method atau class controller
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    // Jika tidak ada role yang dibutuhkan, izinkan akses
    if (!requiredRoles) {
      return true;
    }
    // Mengambil user dari request object (ditempelkan oleh JwtGuard/LocalGuard sebelumnya)
    const { user } = context.switchToHttp().getRequest();
    // Memeriksa apakah role user termasuk dalam role yang diizinkan
    return requiredRoles.some((role) => user.role === role);
  }
}
