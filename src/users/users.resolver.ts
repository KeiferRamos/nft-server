import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { Token, User } from './models/user.entity';
import { createUserInputType } from './dto/create.user.dto';
import { loginUserInputType } from './dto/login.use.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { updateUserInputType } from './dto/update.user.dto';
import { IsAdmin } from 'src/meta/data';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Query(() => [User])
  AllUser() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @IsAdmin()
  @Query(() => User)
  User(@Args('id') id: string, @Context() context) {
    return this.userService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => User)
  viewProfile(@Args('id') id: string, @Context() context) {
    return this.userService.viewUser(id, context);
  }

  @Mutation(() => String)
  createUser(@Args('createUserInput') input: createUserInputType) {
    return this.userService.create(input);
  }

  @Mutation(() => Token)
  loginUser(@Args('loginUserInput') input: loginUserInputType) {
    return this.userService.login(input);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => String)
  marketNft(@Args('id') id: string, @Context() context) {
    return this.userService.marketNft(id, context);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Number)
  Balance(@Context() context) {
    return this.userService.checkBalance(context.req.headers.authorization);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => String)
  updateUser(
    @Context() context,
    @Args('updateUserInput') input: updateUserInputType,
  ) {
    return this.userService.updateProfile(
      context.req.headers.authorization,
      input,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => String)
  sellNft(@Args('id') id: string, @Context() context) {
    return this.userService.sellNft(id, context);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => String)
  buyNft(@Args('id') id: string, @Context() context) {
    return this.userService.buyNft(id, context);
  }

  @IsAdmin()
  @UseGuards(JwtAuthGuard)
  @Mutation(() => String)
  deleteAllUsers() {
    return this.userService.deleteAll();
  }
}
