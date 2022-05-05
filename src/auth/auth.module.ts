import { Module } from '@nestjs/common';
import { AuthConfig } from './config/auth.config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [
    {
      provide: 'AuthConfig',
      useClass: AuthConfig,
    },
    AuthService,
    JwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
