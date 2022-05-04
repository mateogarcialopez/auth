import { Module } from '@nestjs/common';
import { AuthConfig } from './auth.config';
import { AuthService } from './auth.service';

@Module({
  providers: [
    {
      provide: 'AuthConfig',
      useClass: AuthConfig,
    },
    AuthService,
  ],
})
export class AuthModule {}
