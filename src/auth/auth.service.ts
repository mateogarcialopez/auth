import { AuthConfig } from './auth.config';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { AuthDto } from './dtos/auth.dto';

@Injectable()
export class AuthService {
  private userPool: CognitoUserPool;

  constructor(@Inject('AuthConfig') private _authConfig: AuthConfig) {
    /*this.userPool = new CognitoUserPool({
      UserPoolId: this._authConfig.userPoolId,
      ClientId: this._authConfig.clientId,
    });*/
  }

  authenticateUser(user: AuthDto) {
    try {
      const { userID, password } = user;
      const authenticationDetails = new AuthenticationDetails({
        Username: userID,
        Password: password,
      });

      const userData = {
        Username: userID,
        Pool: this.userPool,
      };

      const newUser = new CognitoUser(userData);

      return new Promise((resolve, reject) => {
        return newUser.authenticateUser(authenticationDetails, {
          onSuccess: (result) => {
            resolve(result);
          },
          onFailure: (err) => {
            reject(err);
          },
        });
      });
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: error,
        },
        HttpStatus.CONFLICT,
      );
    }
  }
}
