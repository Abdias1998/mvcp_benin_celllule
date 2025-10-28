import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cell, CellDocument } from './schemas/cell.schema';
import { CreateCellDto } from './dto/create-cell.dto';
import { UpdateCellDto } from './dto/update-cell.dto';
import { User, UserRole } from 'src/shared/types';
import { User as UserSchema, UserDocument } from '../users/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CellsService {
  constructor(
    @InjectModel(Cell.name) private cellModel: Model<CellDocument>,
    @InjectModel(UserSchema.name) private userModel: Model<UserDocument>
  ) {}

  async create(createCellDto: CreateCellDto): Promise<any> {
    // Créer la cellule
    const createdCell = new this.cellModel(createCellDto);
    const savedCell = await createdCell.save();

    // Créer automatiquement le responsable de cellule
    const identifier = await this.generateUniqueIdentifier();
    const hashedPassword = await bcrypt.hash(identifier, 10);

    const cellLeader = new this.userModel({
      name: createCellDto.leaderName,
      contact: createCellDto.leaderContact,
      region: createCellDto.region,
      group: createCellDto.group,
      district: createCellDto.district,
      cellName: createCellDto.cellName,
      cellCategory: createCellDto.cellCategory,
      role: UserRole.CELL_LEADER,
      identifier: identifier,
      status: 'approved',
      password: hashedPassword,
      uid: `cell-leader-${Date.now()}`
    });

    await cellLeader.save();

    // Retourner la cellule et l'identifiant du responsable
    return {
      cell: savedCell,
      leaderIdentifier: identifier
    };
  }

  private async generateUniqueIdentifier(): Promise<string> {
    let identifier: string;
    let exists = true;

    while (exists) {
      identifier = Math.floor(10000 + Math.random() * 90000).toString();
      const existingUser = await this.userModel.findOne({ identifier }).exec();
      exists = !!existingUser;
    }

    return identifier;
  }

  async findAllForUser(user: User | null): Promise<any[]> {
    // If no user is provided, return all cells (public access)
    const query: any = {};
    
    if (user) {
      switch (user.role) {
        case UserRole.REGIONAL_PASTOR:
          query.region = user.region;
          break;
        case UserRole.GROUP_PASTOR:
          query.region = user.region;
          query.group = user.group;
          break;
        case UserRole.DISTRICT_PASTOR:
          query.region = user.region;
          query.group = user.group;
          query.district = user.district;
          break;
      }
    }

    const cells = await this.cellModel.find(query).exec();

    // Pour chaque cellule, trouver le responsable correspondant et ajouter son identifiant
    const cellsWithIdentifier = await Promise.all(
      cells.map(async (cell) => {
        const cellObj = cell.toObject();
        
        // Chercher le responsable de cette cellule
        const leader = await this.userModel.findOne({
          role: UserRole.CELL_LEADER,
          cellName: cell.cellName,
          cellCategory: cell.cellCategory,
          region: cell.region,
          group: cell.group,
          district: cell.district,
        }).exec();

        return {
          ...cellObj,
          leaderIdentifier: leader?.identifier || null,
        };
      })
    );

    return cellsWithIdentifier;
  }

  async update(id: string, updateCellDto: UpdateCellDto): Promise<Cell> {
    // Récupérer la cellule actuelle pour trouver le responsable
    const currentCell = await this.cellModel.findById(id).exec();
    if (!currentCell) {
      throw new Error('Cellule non trouvée');
    }

    // Mettre à jour la cellule
    const updatedCell = await this.cellModel.findByIdAndUpdate(id, updateCellDto, { new: true }).exec();

    // Mettre à jour le responsable de cellule si le nom ou le contact a changé
    if (updateCellDto.leaderName || updateCellDto.leaderContact) {
      // Trouver le responsable actuel
      const currentLeader = await this.userModel.findOne({
        role: UserRole.CELL_LEADER,
        cellName: currentCell.cellName,
        cellCategory: currentCell.cellCategory,
        region: currentCell.region,
        group: currentCell.group,
        district: currentCell.district,
      }).exec();

      if (currentLeader) {
        const updateData: any = {};
        
        // Ne mettre à jour que si la valeur a réellement changé
        if (updateCellDto.leaderName && updateCellDto.leaderName !== currentLeader.name) {
          updateData.name = updateCellDto.leaderName;
        }
        
        if (updateCellDto.leaderContact && updateCellDto.leaderContact !== currentLeader.contact) {
          updateData.contact = updateCellDto.leaderContact;
        }

        // Mettre à jour seulement s'il y a des changements
        if (Object.keys(updateData).length > 0) {
          await this.userModel.findByIdAndUpdate(currentLeader._id, updateData).exec();
        }
      }
    }

    return updatedCell;
  }

  async remove(id: string): Promise<any> {
    return this.cellModel.findByIdAndDelete(id).exec();
  }
}
