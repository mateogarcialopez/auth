import { AuthConfig } from './config/auth.config';
import { Inject, Injectable } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { AuthDto } from './dtos/auth.dto';
import { RegisterDto } from './dtos/register.dto';

@Injectable()
export class AuthService {
  private userPool: CognitoUserPool;

  constructor(@Inject('AuthConfig') private _authConfig: AuthConfig) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this._authConfig.userPoolId,
      ClientId: this._authConfig.clientId,
    });
  }

  authenticateUser(data: AuthDto) {
    const { userID, password } = data;
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
  }

  registerUser(registerRequest: RegisterDto) {
    const { name, password } = registerRequest;
    return new Promise((resolve, reject) => {
      return this.userPool.signUp(
        name,
        password,
        null,
        null,
        (error, result) => {
          if (!result) {
            reject(error);
          } else {
            resolve(result.user);
          }
        },
      );
    });
  }
}
