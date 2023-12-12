import { Module, forwardRef } from '@nestjs/common';
import { NftResolver } from './nft.resolver';
import { NftService } from './nft.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nft } from './models/nft.entity';
import { UsersModule } from 'src/users/users.module';
import { Comment } from './models/comment.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      secret: process.env.SECRET,
    }),
    TypeOrmModule.forFeature([Nft, Comment]),
    forwardRef(() => UsersModule),
    forwardRef(() => AdminModule),
  ],
  exports: [NftService],
  providers: [NftResolver, NftService],
})
export class NftModule {}
