import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AdminService } from './admin.service';
import { Admin } from './entities/admin.entity';
import { CreateAdminInput } from './dto/create-admin.input';
import { LoginAdminInput } from './dto/login-admin.input';
import { Token, User } from 'src/users/models/user.entity';
import { IsAdmin } from 'src/meta/data';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Resolver(() => Admin)
export class AdminResolver {
  constructor(private readonly adminService: AdminService) {}

  @Mutation(() => Admin)
  createAdmin(@Args('createAdminInput') createAdminInput: CreateAdminInput) {
    return this.adminService.create(createAdminInput);
  }

  @Query(() => Admin, { name: 'Admin' })
  findOne(@Args('id', { type: () => Int }) id: string) {
    return this.adminService.findOne(id);
  }

  @Mutation(() => Token)
  loginAdmin(@Args('LoginAdminInput') input: LoginAdminInput) {
    return this.adminService.login(input);
  }

  @IsAdmin()
  @UseGuards(JwtAuthGuard)
  @Mutation(() => String)
  removeUser(@Args('id', { type: () => String }) id: string) {
    return this.adminService.remove(id);
  }

  @IsAdmin()
  @UseGuards(JwtAuthGuard)
  @Mutation(() => String)
  restoreUser(@Args('id', { type: () => String }) id: string) {
    return this.adminService.restore(id);
  }
}
