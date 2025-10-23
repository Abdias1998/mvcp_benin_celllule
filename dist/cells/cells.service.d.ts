import { Model } from 'mongoose';
import { Cell, CellDocument } from './schemas/cell.schema';
import { CreateCellDto } from './dto/create-cell.dto';
import { UpdateCellDto } from './dto/update-cell.dto';
import { User } from 'src/shared/types';
export declare class CellsService {
    private cellModel;
    constructor(cellModel: Model<CellDocument>);
    create(createCellDto: CreateCellDto): Promise<Cell>;
    findAllForUser(user: User | null): Promise<Cell[]>;
    update(id: string, updateCellDto: UpdateCellDto): Promise<Cell>;
    remove(id: string): Promise<any>;
}
