"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
let AuthService = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async validateUser(identifier, pass) {
        const user = await this.usersService.findByEmailOrContact(identifier);
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user.toObject();
            return result;
        }
        return null;
    }
    async login(loginDto) {
        const user = await this.validateUser(loginDto.identifier, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Email/Téléphone ou mot de passe incorrect.');
        }
        if (user.status !== 'approved') {
            throw new common_1.UnauthorizedException("Votre compte est en attente d'approbation.");
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
    async register(registerDto) {
        if (!registerDto.email && !registerDto.contact) {
            throw new common_1.ConflictException('Vous devez fournir au moins un email ou un numéro de téléphone.');
        }
        if (registerDto.email) {
            const existingUserByEmail = await this.usersService.findByEmail(registerDto.email);
            if (existingUserByEmail) {
                throw new common_1.ConflictException('Un utilisateur avec cet email existe déjà.');
            }
        }
        if (registerDto.contact) {
            const existingUserByContact = await this.usersService.findByContact(registerDto.contact);
            if (existingUserByContact) {
                throw new common_1.ConflictException('Un utilisateur avec ce numéro de téléphone existe déjà.');
            }
        }
        const userData = {
            ...registerDto,
            email: registerDto.email && registerDto.email.trim() !== '' ? registerDto.email : undefined,
            contact: registerDto.contact && registerDto.contact.trim() !== '' ? registerDto.contact : undefined,
        };
        await this.usersService.create(userData);
        return { success: true, message: "Inscription réussie. Votre compte est en attente d'approbation." };
    }
    async requestPasswordReset(requestDto) {
        const user = await this.usersService.findByContact(requestDto.contact);
        if (!user) {
            throw new common_1.NotFoundException('Aucun utilisateur trouvé avec ce numéro de téléphone.');
        }
        if (user.name.toLowerCase() !== requestDto.name.toLowerCase()) {
            throw new common_1.BadRequestException('Les informations fournies ne correspondent pas à notre base de données.');
        }
        if (user.region !== requestDto.region) {
            throw new common_1.BadRequestException('Les informations fournies ne correspondent pas à notre base de données.');
        }
        if (requestDto.group && user.group !== requestDto.group) {
            throw new common_1.BadRequestException('Les informations fournies ne correspondent pas à notre base de données.');
        }
        if (requestDto.district && user.district !== requestDto.district) {
            throw new common_1.BadRequestException('Les informations fournies ne correspondent pas à notre base de données.');
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const expires = new Date();
        expires.setHours(expires.getHours() + 24);
        await this.usersService.updateResetToken(user._id.toString(), hashedToken, expires);
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
    async resetPassword(resetDto) {
        const hashedToken = crypto.createHash('sha256').update(resetDto.token).digest('hex');
        const user = await this.usersService.findByResetToken(hashedToken);
        if (!user) {
            throw new common_1.BadRequestException('Token de réinitialisation invalide ou expiré.');
        }
        if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
            throw new common_1.BadRequestException('Token de réinitialisation expiré. Veuillez faire une nouvelle demande.');
        }
        const hashedPassword = await bcrypt.hash(resetDto.newPassword, 10);
        await this.usersService.updatePassword(user._id.toString(), hashedPassword);
        return {
            success: true,
            message: 'Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.',
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map