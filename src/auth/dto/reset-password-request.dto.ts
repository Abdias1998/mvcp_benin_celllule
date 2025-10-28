import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class ResetPasswordRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  contact: string;

  @IsString()
  @IsNotEmpty()
  region: string;

  @IsString()
  @IsOptional()
  group?: string;

  @IsString()
  @IsOptional()
  district?: string;

  @IsString()
  @IsOptional()
  groupPastorName?: string;

  @IsString()
  @IsOptional()
  districtPastorName?: string;
}
