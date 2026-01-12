// Mengimpor SetMetadata dari NestJS untuk menambahkan metadata kustom ke route handler
import { SetMetadata } from '@nestjs/common';
// Mengimpor enum UserRole
import { UserRole } from '../users/entities/user.entity';

// Kunci metadata untuk roles
export const ROLES_KEY = 'roles';
// Dekorator kustom @Roles untuk menentukan role apa yang diizinkan mengakses endpoint
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
