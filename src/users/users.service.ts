import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Cell, CellDocument } from '../cells/schemas/cell.schema';
import { PastorData, UserRole } from '../shared/types';
import { ReassignUserDto } from './dto/reassign-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Cell.name) private cellModel: Model<CellDocument>
  ) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  async findByContact(contact: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ contact }).exec();
  }

  async findByEmailOrContact(identifier: string): Promise<UserDocument | null> {
    // Vérifier si l'identifiant ressemble à un email (contient @)
    if (identifier.includes('@')) {
      return this.findByEmail(identifier);
    }
    // Sinon, c'est un numéro de téléphone
    return this.findByContact(identifier);
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async create(createPastorDto: PastorData): Promise<UserDocument> {
    const hashedPassword = await bcrypt.hash(createPastorDto.password, 10);
    const createdUser = new this.userModel({
      ...createPastorDto,
      password: hashedPassword,
      uid: `user-${Date.now()}` // Match frontend local UID format
    });
    return createdUser.save();
  }

  async getPendingPastors(): Promise<User[]> {
    return this.userModel.find({ status: 'pending' }).exec();
  }

  async getPastors(): Promise<User[]> {
    return this.userModel.find({ 
      status: 'approved',
      role: { $ne: UserRole.NATIONAL_COORDINATOR }
    }).exec();
  }

  async approvePastor(id: string): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, { status: 'approved' }, { new: true }).exec();
  }
  
  async update(id: string, updatePastorDto: Partial<PastorData>): Promise<User> {
    // Do not update the password via this method
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...dataToUpdate } = updatePastorDto;
    return this.userModel.findByIdAndUpdate(id, dataToUpdate, { new: true }).exec();
  }

  async delete(id: string): Promise<any> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async getUsersByHierarchy(currentUser: UserDocument): Promise<any[]> {
    const query: any = { status: 'approved' };

    console.log('🔍 getUsersByHierarchy - Current User:', {
      role: currentUser.role,
      region: currentUser.region,
      group: currentUser.group,
      district: currentUser.district
    });

    // Pasteur Régional : voit tous les pasteurs de groupe, pasteurs de district et responsables de cellule de sa région
    if (currentUser.role === UserRole.REGIONAL_PASTOR) {
      query.$or = [
        // Pasteurs de groupe de la même région
        {
          role: UserRole.GROUP_PASTOR,
          region: currentUser.region
        },
        // Pasteurs de district de la même région
        {
          role: UserRole.DISTRICT_PASTOR,
          region: currentUser.region
        },
        // Responsables de cellule de la même région
        {
          role: UserRole.CELL_LEADER,
          region: currentUser.region
        }
      ];
    }
    // Pasteur de Groupe : voit tous les pasteurs de district + responsables de cellule de son groupe
    else if (currentUser.role === UserRole.GROUP_PASTOR) {
      query.$or = [
        // Pasteurs de district du même groupe
        {
          role: UserRole.DISTRICT_PASTOR,
          region: currentUser.region,
          group: currentUser.group
        },
        // Responsables de cellule du même groupe
        {
          role: UserRole.CELL_LEADER,
          region: currentUser.region,
          group: currentUser.group
        }
      ];
    }
    // Pasteur de District : voit tous les responsables de cellule de son district
    else if (currentUser.role === UserRole.DISTRICT_PASTOR) {
      query.role = UserRole.CELL_LEADER;
      query.region = currentUser.region;
      query.group = currentUser.group;
      query.district = currentUser.district;
    }
    // Autres rôles : ne voient personne (ou retourner un tableau vide)
    else {
      return [];
    }

    console.log('🔍 Query:', JSON.stringify(query, null, 2));

    const results = await this.userModel.find(query).select('-password').exec();
    
    console.log(`🔍 Found ${results.length} users`);
    results.forEach(u => {
      console.log(`  - ${u.name} (${u.role}) - Region: ${u.region}, Group: ${u.group}, District: ${u.district}`);
    });

    // Enrichir les CELL_LEADER avec initialMembersCount depuis leur cellule
    const enrichedResults = await Promise.all(results.map(async (user) => {
      const userObj = user.toObject();
      
      if (user.role === UserRole.CELL_LEADER) {
        console.log(`🔍 Processing CELL_LEADER: ${user.name}`);
        console.log(`   - cellName: ${user.cellName}`);
        console.log(`   - region: ${user.region}, group: ${user.group}, district: ${user.district}`);
        console.log(`   - cellCategory: ${user.cellCategory}`);
        
        if (user.cellName) {
          // Récupérer la cellule correspondante
          const cell = await this.cellModel.findOne({
            region: user.region,
            group: user.group,
            district: user.district,
            cellName: user.cellName,
            cellCategory: user.cellCategory
          }).exec();
          
          if (cell) {
            console.log(`✅ Found cell with initialMembersCount: ${cell.initialMembersCount}`);
            (userObj as any).initialMembersCount = cell.initialMembersCount || 0;
          } else {
            console.log(`❌ Cell not found for ${user.name}`);
            console.log(`   Query was: region=${user.region}, group=${user.group}, district=${user.district}, cellName=${user.cellName}, cellCategory=${user.cellCategory}`);
          }
        } else {
          console.log(`⚠️  CELL_LEADER ${user.name} has no cellName defined!`);
        }
      }
      
      return userObj;
    }));
    
    console.log(`🔍 Returning ${enrichedResults.length} enriched users`);

    return enrichedResults;
  }

  /**
   * Met à jour le token de réinitialisation de mot de passe
   */
  async updateResetToken(userId: string, token: string, expires: Date): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      resetPasswordToken: token,
      resetPasswordExpires: expires,
    }).exec();
  }

  /**
   * Recherche un utilisateur par son token de réinitialisation
   */
  async findByResetToken(token: string): Promise<UserDocument | null> {
    return this.userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }, // Token non expiré
    }).exec();
  }

  /**
   * Met à jour le mot de passe et supprime le token de réinitialisation
   */
  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      password: hashedPassword,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
    }).exec();
  }

  /**
   * Réaffecte un pasteur à un nouveau groupe/district/région
   * Met à jour automatiquement toutes les cellules et rapports associés
   */
  async reassignUser(reassignDto: ReassignUserDto): Promise<any> {
    const { userId, newRole, newRegion, newGroup, newDistrict } = reassignDto;

    // 1. Récupérer l'utilisateur actuel
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    console.log('🔄 Réaffectation de l\'utilisateur:', {
      userId,
      currentRole: user.role,
      currentRegion: user.region,
      currentGroup: user.group,
      currentDistrict: user.district,
      newRole,
      newRegion,
      newGroup,
      newDistrict
    });

    // Sauvegarder les anciennes valeurs pour la mise à jour des cellules
    const oldRegion = user.region;
    const oldGroup = user.group;
    const oldDistrict = user.district;
    const oldRole = user.role;

    // 2. Préparer les données de mise à jour
    const updateData: any = {};
    if (newRole !== undefined) updateData.role = newRole;
    if (newRegion !== undefined) updateData.region = newRegion;
    if (newGroup !== undefined) updateData.group = newGroup;
    if (newDistrict !== undefined) updateData.district = newDistrict;

    // 3. Mettre à jour l'utilisateur
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('-password').exec();

    console.log('✅ Utilisateur mis à jour:', {
      name: updatedUser.name,
      role: updatedUser.role,
      region: updatedUser.region,
      group: updatedUser.group,
      district: updatedUser.district
    });

    // 4. Mettre à jour les cellules associées selon le rôle
    let cellsUpdated = 0;
    
    if (oldRole === UserRole.GROUP_PASTOR || newRole === UserRole.GROUP_PASTOR) {
      // Mettre à jour toutes les cellules du groupe
      const cellQuery: any = {
        region: oldRegion,
        group: oldGroup
      };

      const cellUpdateData: any = {};
      if (newRegion !== undefined) cellUpdateData.region = newRegion;
      if (newGroup !== undefined) cellUpdateData.group = newGroup;

      const cellsResult = await this.cellModel.updateMany(
        cellQuery,
        { $set: cellUpdateData }
      ).exec();
      
      cellsUpdated = cellsResult.modifiedCount;
      console.log(`✅ ${cellsUpdated} cellule(s) mise(s) à jour pour le groupe`);
    } 
    else if (oldRole === UserRole.DISTRICT_PASTOR || newRole === UserRole.DISTRICT_PASTOR) {
      // Mettre à jour toutes les cellules du district
      const cellQuery: any = {
        region: oldRegion,
        group: oldGroup,
        district: oldDistrict
      };

      const cellUpdateData: any = {};
      if (newRegion !== undefined) cellUpdateData.region = newRegion;
      if (newGroup !== undefined) cellUpdateData.group = newGroup;
      if (newDistrict !== undefined) cellUpdateData.district = newDistrict;

      const cellsResult = await this.cellModel.updateMany(
        cellQuery,
        { $set: cellUpdateData }
      ).exec();
      
      cellsUpdated = cellsResult.modifiedCount;
      console.log(`✅ ${cellsUpdated} cellule(s) mise(s) à jour pour le district`);
    }
    else if (oldRole === UserRole.CELL_LEADER) {
      // Mettre à jour la cellule spécifique du responsable
      const cellQuery: any = {
        region: oldRegion,
        group: oldGroup,
        district: oldDistrict,
        cellName: user.cellName,
        cellCategory: user.cellCategory
      };

      const cellUpdateData: any = {};
      if (newRegion !== undefined) cellUpdateData.region = newRegion;
      if (newGroup !== undefined) cellUpdateData.group = newGroup;
      if (newDistrict !== undefined) cellUpdateData.district = newDistrict;

      const cellsResult = await this.cellModel.updateMany(
        cellQuery,
        { $set: cellUpdateData }
      ).exec();
      
      cellsUpdated = cellsResult.modifiedCount;
      console.log(`✅ ${cellsUpdated} cellule(s) mise(s) à jour pour le responsable`);
    }

    return {
      success: true,
      message: 'Réaffectation effectuée avec succès',
      user: updatedUser,
      cellsUpdated,
      details: {
        oldHierarchy: {
          role: oldRole,
          region: oldRegion,
          group: oldGroup,
          district: oldDistrict
        },
        newHierarchy: {
          role: updatedUser.role,
          region: updatedUser.region,
          group: updatedUser.group,
          district: updatedUser.district
        }
      }
    };
  }
}
