import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { PastorData, UserRole } from '../shared/types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

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

  async getUsersByHierarchy(currentUser: UserDocument): Promise<User[]> {
    const query: any = { status: 'approved' };

    console.log('🔍 getUsersByHierarchy - Current User:', {
      role: currentUser.role,
      region: currentUser.region,
      group: currentUser.group,
      district: currentUser.district
    });

    // Pasteur de Groupe : voit tous les pasteurs de district + responsables de cellule de son groupe
    if (currentUser.role === UserRole.GROUP_PASTOR) {
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

    return results;
  }
}
