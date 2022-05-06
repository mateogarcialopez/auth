import { AuthConfig } from './config/auth.config';
import { Inject, Injectable } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
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
    const { rut } = data;
    const userid = process.env.USERID;
    const newUser = new CognitoUser({ Username: userid, Pool: this.userPool });

    const attribute = [
      new CognitoUserAttribute({
        Name: 'custom:rut',
        Value: rut,
      }),
    ];

    const authenticationDetails = new AuthenticationDetails({
      Username: process.env.USERID,
      Password: process.env.USERPASSWORD,
    });

    return new Promise((resolve, reject) => {
      newUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          newUser.updateAttributes(attribute, (err, res) => {
            if (err) {
              reject(err);
            }
            return newUser.authenticateUser(authenticationDetails, {
              onSuccess: (result) => {
                resolve({ idToken: result.getIdToken().getJwtToken() });
              },
              onFailure: (err) => {
                reject(err);
              },
            });
          });
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }

  registerUser(registerRequest: RegisterDto) {
    const { name, password, rut } = registerRequest;
    return new Promise((resolve, reject) => {
      return this.userPool.signUp(
        'edwin',
        'Edwin3136043363*',
        [
          new CognitoUserAttribute({
            Name: 'custom:rut',
            Value: rut,
          }),
        ],
        //null,
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
