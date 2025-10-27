import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { CreateCellLeaderDto } from './dto/create-cell-leader.dto';
export declare class CellLeadersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    create(createCellLeaderDto: CreateCellLeaderDto, currentUser: UserDocument): Promise<{
        identifier: string;
        user: import("mongoose").Document<unknown, {}, UserDocument, {}, {}> & User & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    private generateUniqueIdentifier;
}
