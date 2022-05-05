import { IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  readonly userID: string;

  @IsNotEmpty()
  readonly password: string;
}
