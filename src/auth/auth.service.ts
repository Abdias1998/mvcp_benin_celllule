import { Injectable, UnauthorizedException, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
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
    // Convertir les chaînes vides en undefined pour éviter les problèmes d'index unique
    const userData = {
      ...registerDto,
      email: registerDto.email && registerDto.email.trim() !== '' ? registerDto.email : undefined,
      contact: registerDto.contact && registerDto.contact.trim() !== '' ? registerDto.contact : undefined,
    };

    await this.usersService.create(userData);

    return { success: true, message: "Inscription réussie. Votre compte est en attente d'approbation." };
  }

  /**
   * Demande de réinitialisation de mot de passe
   * Vérifie les informations de l'utilisateur et retourne un message d'instructions WhatsApp
   */
  async requestPasswordReset(requestDto: ResetPasswordRequestDto): Promise<{ success: boolean; message: string }> {
    // Rechercher l'utilisateur par numéro de téléphone
    const user = await this.usersService.findByContact(requestDto.contact);
    
    if (!user) {
      throw new NotFoundException('Aucun utilisateur trouvé avec ce numéro de téléphone.');
    }

    // Vérifier que le nom correspond
    if (user.name.toLowerCase() !== requestDto.name.toLowerCase()) {
      throw new BadRequestException('Les informations fournies ne correspondent pas à notre base de données.');
    }

    // Vérifier que la région correspond
    if (user.region !== requestDto.region) {
      throw new BadRequestException('Les informations fournies ne correspondent pas à notre base de données.');
    }

    // Vérifier le groupe si fourni
    if (requestDto.group && user.group !== requestDto.group) {
      throw new BadRequestException('Les informations fournies ne correspondent pas à notre base de données.');
    }

    // Vérifier le district si fourni
    if (requestDto.district && user.district !== requestDto.district) {
      throw new BadRequestException('Les informations fournies ne correspondent pas à notre base de données.');
    }

    // Générer un token de réinitialisation sécurisé
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Définir l'expiration du token (24 heures)
    const expires = new Date();
    expires.setHours(expires.getHours() + 24);

    // Sauvegarder le token hashé dans la base de données
    await this.usersService.updateResetToken(user._id.toString(), hashedToken, expires);

    // Construire le message WhatsApp avec les informations
    const whatsappMessage = `
📋 DEMANDE DE RÉINITIALISATION DE MOT DE PASSE

Nom: ${requestDto.name}
Région: ${requestDto.region}
${requestDto.group ? `Groupe/District: ${requestDto.group}` : ''}
${requestDto.district ? `District/Localité: ${requestDto.district}` : ''}
${requestDto.groupPastorName ? `Pasteur de Groupe/District: ${requestDto.groupPastorName}` : ''}
${requestDto.districtPastorName ? `Pasteur de District/Localité: ${requestDto.districtPastorName}` : ''}
Téléphone: ${requestDto.contact}

Token de réinitialisation: ${resetToken}
    `.trim();

    return {
      success: true,
      message: `Veuillez envoyer les informations suivantes par WhatsApp au +229 01 67 91 91 50 :\n\n${whatsappMessage}\n\nVous recevrez un lien pour réinitialiser votre mot de passe.`,
    };
  }

  /**
   * Réinitialisation du mot de passe avec le token
   */
  async resetPassword(resetDto: ResetPasswordDto): Promise<{ success: boolean; message: string }> {
    // Hasher le token reçu pour le comparer avec celui en base de données
    const hashedToken = crypto.createHash('sha256').update(resetDto.token).digest('hex');

    // Rechercher l'utilisateur avec ce token et vérifier qu'il n'a pas expiré
    const user = await this.usersService.findByResetToken(hashedToken);

    if (!user) {
      throw new BadRequestException('Token de réinitialisation invalide ou expiré.');
    }

    // Vérifier que le token n'a pas expiré
    if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
      throw new BadRequestException('Token de réinitialisation expiré. Veuillez faire une nouvelle demande.');
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(resetDto.newPassword, 10);

    // Mettre à jour le mot de passe et supprimer le token
    await this.usersService.updatePassword(user._id.toString(), hashedPassword);

    return {
      success: true,
      message: 'Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.',
    };
  }
}