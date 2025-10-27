import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: 'Email ou numéro de téléphone requis.' })
  identifier: string; // Peut être un email ou un numéro de téléphone

  @IsString()
  @IsNotEmpty()
  password: string;
}
