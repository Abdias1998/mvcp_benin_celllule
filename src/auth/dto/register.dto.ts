import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional, Matches, ValidateIf, Validate } from 'class-validator';
import { UserRole } from '../../shared/types';
import { AtLeastOne } from '../validators/at-least-one.validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @ValidateIf((o) => !o.contact || o.email)
  @IsEmail({}, { message: 'Email invalide.' })
  @IsOptional()
  @AtLeastOne(['email', 'contact'], { message: 'Vous devez fournir au moins un email ou un numéro de téléphone.' })
  email?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères.' })
  password: string;
  
  @ValidateIf((o) => !o.email || o.contact)
  @IsString()
  @Matches(/^01[0-9]{8}$/, { message: 'Le numéro doit contenir 10 chiffres et commencer par 01.'})
  @IsOptional()
  contact?: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @IsString()
  @IsNotEmpty()
  region: string;

  @IsOptional()
  @IsString()
  group?: string;

  @IsOptional()
  @IsString()
  district?: string;
}
