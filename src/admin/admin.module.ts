import { Module, forwardRef } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminResolver } from './admin.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { JwtModule } from '@nestjs/jwt';
import { NftModule } from 'src/nft/nft.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    forwardRef(() => NftModule),
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([Admin]),
    JwtModule.register({
      secret: process.env.SECRET,
    }),
  ],
  exports: [AdminService],
  providers: [AdminResolver, AdminService],
})
export class AdminModule {}
