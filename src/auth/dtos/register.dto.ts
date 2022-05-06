import { IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  name: string;
  
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  rut: string;
}
