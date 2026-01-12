// Mengimpor Module dari NestJS
import { Module } from '@nestjs/common';
// Mengimpor TypeOrmModule untuk integrasi database
import { TypeOrmModule } from '@nestjs/typeorm';
// Mengimpor Entitas User
import { User } from './entities/user.entity';
// Mengimpor UsersController
import { UsersController } from './users.controller';
// Mengimpor UsersService
import { UsersService } from './users.service';

// Definisi Modul Users
@Module({
  // Mendaftarkan entitas User
  imports: [TypeOrmModule.forFeature([User])],
  // Mendaftarkan Service
  providers: [UsersService],
  // Mendaftarkan Controller
  controllers: [UsersController],
  // Mengekspor UsersService (penting untuk AuthModule)
  exports: [UsersService],
})
export class UsersModule {}
