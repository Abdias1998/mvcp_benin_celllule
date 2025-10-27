import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from 'src/shared/types';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(identifier: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmailOrContact(identifier);
    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.identifier, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Email/Téléphone ou mot de passe incorrect.');
    }
    if (user.status !== 'approved') {
      throw new UnauthorizedException("Votre compte est en attente d'approbation.");
    }

    const payload = { 
      email: user.email, 
      contact: user.contact,
      sub: user._id.toString(), 
      role: user.role 
    };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(registerDto: RegisterDto): Promise<{ success: boolean; message: string }> {
    // Vérifier qu'au moins l'email ou le téléphone est fourni
    if (!registerDto.email && !registerDto.contact) {
      throw new ConflictException('Vous devez fournir au moins un email ou un numéro de téléphone.');
    }

    // Vérifier si un utilisateur avec cet email existe déjà
    if (registerDto.email) {
      const existingUserByEmail = await this.usersService.findByEmail(registerDto.email);
      if (existingUserByEmail) {
        throw new ConflictException('Un utilisateur avec cet email existe déjà.');
      }
    }

    // Vérifier si un utilisateur avec ce numéro de téléphone existe déjà
    if (registerDto.contact) {
      const existingUserByContact = await this.usersService.findByContact(registerDto.contact);
      if (existingUserByContact) {
        throw new ConflictException('Un utilisateur avec ce numéro de téléphone existe déjà.');
      }
    }

    // The user schema now has a default value for `status`, so we don't need to set it here.
    await this.usersService.create({
      ...registerDto,
    });

    return { success: true, message: "Inscription réussie. Votre compte est en attente d'approbation." };
  }
}