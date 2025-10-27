import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { CreateCellLeaderDto } from './dto/create-cell-leader.dto';
import { UserRole } from '../shared/types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CellLeadersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createCellLeaderDto: CreateCellLeaderDto, currentUser: UserDocument) {
    // Générer un identifiant unique de 5 chiffres
    const identifier = await this.generateUniqueIdentifier();

    // Hasher l'identifiant pour l'utiliser comme mot de passe
    const hashedPassword = await bcrypt.hash(identifier, 10);

    // Créer le responsable de cellule
    const cellLeader = new this.userModel({
      name: createCellLeaderDto.name,
      contact: createCellLeaderDto.contact,
      region: createCellLeaderDto.region,
      group: createCellLeaderDto.group,
      district: createCellLeaderDto.district,
      cellName: createCellLeaderDto.cellName,
      cellCategory: createCellLeaderDto.cellCategory,
      role: UserRole.CELL_LEADER,
      identifier: identifier,
      status: 'approved', // Les responsables de cellule sont automatiquement approuvés
      password: hashedPassword, // Mot de passe hashé
      uid: `cell-leader-${Date.now()}`
    });

    const savedCellLeader = await cellLeader.save();

    // Retourner l'identifiant et l'utilisateur créé
    return {
      identifier: identifier,
      user: savedCellLeader
    };
  }

  private async generateUniqueIdentifier(): Promise<string> {
    let identifier: string;
    let exists = true;

    // Générer un identifiant unique
    while (exists) {
      // Générer un nombre aléatoire de 5 chiffres (10000 à 99999)
      identifier = Math.floor(10000 + Math.random() * 90000).toString();
      
      // Vérifier si l'identifiant existe déjà
      const existingUser = await this.userModel.findOne({ identifier }).exec();
      exists = !!existingUser;
    }

    return identifier;
  }
}
