// Mengimpor validator
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
// Mengimpor Enum UserRole
import { UserRole } from '../entities/user.entity';

// DTO untuk pembuatan user (registrasi)
export class CreateUserDto {
  // Validasi format email
  @IsEmail()
  email: string;

  // Validasi password string, tidak kosong, minimal 6 karakter
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  // Validasi role (harus sesuai enum UserRole), opsional
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
