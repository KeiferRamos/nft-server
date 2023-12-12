import { Module, forwardRef } from '@nestjs/common';
import { JwtAuthGuard } from './auth.guard';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './jwt.strategy';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    forwardRef(() => AdminModule),

    JwtModule.register({
      secret: process.env.SECRET,
    }),
  ],
  exports: [JwtAuthGuard, LocalStrategy],
  providers: [JwtAuthGuard, LocalStrategy],
})
export class AuthModule {}
