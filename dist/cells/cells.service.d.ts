import { Model } from 'mongoose';
import { Cell, CellDocument } from './schemas/cell.schema';
import { CreateCellDto } from './dto/create-cell.dto';
import { UpdateCellDto } from './dto/update-cell.dto';
import { User } from 'src/shared/types';
import { UserDocument } from '../users/schemas/user.schema';
export declare class CellsService {
    private cellModel;
    private userModel;
    constructor(cellModel: Model<CellDocument>, userModel: Model<UserDocument>);
    create(createCellDto: CreateCellDto): Promise<any>;
    private generateUniqueIdentifier;
    findAllForUser(user: User | null): Promise<any[]>;
    update(id: string, updateCellDto: UpdateCellDto): Promise<Cell>;
    remove(id: string): Promise<any>;
}
