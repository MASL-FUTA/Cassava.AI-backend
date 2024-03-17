import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyTokenDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}
