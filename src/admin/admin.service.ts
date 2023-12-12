import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAdminInput } from './dto/create-admin.input';
import { LoginAdminInput } from './dto/login-admin.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async create({ username, password }: CreateAdminInput) {
    try {
      const isUsernameValid = await this.adminRepository.findOneBy({
        username,
      });
      if (isUsernameValid) {
        throw new BadRequestException('username already in used');
      }

      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);

      const admin = this.adminRepository.create({
        username,
        password: hashPassword,
      });

      return this.adminRepository.save(admin);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async login({ username, password }: LoginAdminInput) {
    try {
      const isValidUser = await this.adminRepository.findOneBy({ username });

      if (!isValidUser) {
        throw new BadRequestException('Invalid username or password');
      }

      const verifyPassword = await bcrypt.compare(
        password,
        isValidUser.password,
      );

      if (!verifyPassword) {
        throw new BadRequestException('Invalid username or password');
      }

      return {
        access_token: this.jwtService.sign(
          {
            id: isValidUser.id,
          },
          { expiresIn: '8h' },
        ),
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  findOne(id: string) {
    return this.adminRepository.findOneBy({ id });
  }

  remove(id: string) {
    return this.userService.deleteOne(id);
  }

  restore(id: string) {
    return this.userService.restoreOne(id);
  }
}
