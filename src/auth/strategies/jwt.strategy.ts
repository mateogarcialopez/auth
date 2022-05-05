import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthConfig } from '../config/auth.config';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly _authService: AuthService,
    @Inject('AuthConfig') private _authConfig: AuthConfig,
  ) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${_authConfig.authority}/.well-known/jwks.json`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: _authConfig.clientId,
      issuer: _authConfig.authority,
      algorithms: ['RS256'],
    });
  }

  public async validate(payload: any) {
    return !!payload.sub;
  }
}
