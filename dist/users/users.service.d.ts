import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CellDocument } from '../cells/schemas/cell.schema';
import { PastorData } from '../shared/types';
export declare class UsersService {
    private userModel;
    private cellModel;
    constructor(userModel: Model<UserDocument>, cellModel: Model<CellDocument>);
    findByEmail(email: string): Promise<UserDocument | null>;
    findByContact(contact: string): Promise<UserDocument | null>;
    findByEmailOrContact(identifier: string): Promise<UserDocument | null>;
    findById(id: string): Promise<UserDocument | null>;
    create(createPastorDto: PastorData): Promise<UserDocument>;
    getPendingPastors(): Promise<User[]>;
    getPastors(): Promise<User[]>;
    approvePastor(id: string): Promise<User>;
    update(id: string, updatePastorDto: Partial<PastorData>): Promise<User>;
    delete(id: string): Promise<any>;
    getUsersByHierarchy(currentUser: UserDocument): Promise<any[]>;
    updateResetToken(userId: string, token: string, expires: Date): Promise<void>;
    findByResetToken(token: string): Promise<UserDocument | null>;
    updatePassword(userId: string, hashedPassword: string): Promise<void>;
}
