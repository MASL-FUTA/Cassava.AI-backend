import { IsNotEmpty, IsString } from 'class-validator';

export class ResourceDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsString()
  @IsNotEmpty()
  img: string;

  @IsString()
  @IsNotEmpty()
  url: string;
}
