// Mengimpor dekorator validasi dari class-validator
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

// DTO untuk data login
export class LoginDto {
  // Memvalidasi format email
  @IsEmail()
  email: string;

  // Memvalidasi tipe string dan tidak boleh kosong
  @IsString()
  @IsNotEmpty()
  password: string;
}
