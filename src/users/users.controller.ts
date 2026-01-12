// Mengimpor Controller dari NestJS
import { Controller } from '@nestjs/common';

// Controller untuk route 'users'
// Saat ini kosong karena logika user sebagian besar di handle di AuthService/AuthController
@Controller('users')
export class UsersController {}
