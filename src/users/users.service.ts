// Mengimpor Exception dan Injectable dari NestJS
import { ConflictException, Injectable } from '@nestjs/common';
// Mengimpor InjectRepository
import { InjectRepository } from '@nestjs/typeorm';
// Mengimpor bcrypt untuk hashing password
import * as bcrypt from 'bcrypt';
// Mengimpor Repository TypeORM
import { Repository } from 'typeorm';
// Mengimpor DTO CreateUserDto
import { CreateUserDto } from './dto/create-user.dto';
// Mengimpor Entitas User
import { User } from './entities/user.entity';

// Service untuk logika bisnis User
@Injectable()
export class UsersService {
  // Konstruktor menyuntikkan Repository User
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Fungsi membuat user baru
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Mengecek apakah email sudah terdaftar
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    // Jika sudah ada, lempar error Conflict (409)
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Melakukan hashing password dengan salt round 10
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    // Membuat instance user baru
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword, // Simpan password yang sudah di-hash
    });

    // Menyimpan user ke database
    return this.usersRepository.save(user);
  }

  // Mencari user berdasarkan email (digunakan untuk login)
  async findOne(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  // Mencari user berdasarkan ID
  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }
}
