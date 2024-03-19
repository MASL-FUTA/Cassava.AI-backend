import { IsBase64, IsOptional, IsString, IsUrl } from 'class-validator';

export class ClassificationDto {
  @IsString()
  @IsUrl()
  url: string;

  @IsOptional()
  @IsBase64()
  base64String?: string;
}
