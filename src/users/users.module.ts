import { Module, forwardRef } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { NftModule } from 'src/nft/nft.module';
import { Address } from './models/adress.entity';
import { Message } from './models/message.entity';
import { Nft } from 'src/nft/models/nft.entity';
import { AdminModule } from 'src/admin/admin.module';
import { Admin } from 'src/admin/entities/admin.entity';

@Module({
  imports: [
    forwardRef(() => NftModule),
    forwardRef(() => AdminModule),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([User, Address, Message, Nft, Admin]),
    JwtModule.register({
      secret: process.env.SECRET,
    }),
  ],
  exports: [UsersService],
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}
