import { CellsService } from './cells.service';
import { CreateCellDto } from './dto/create-cell.dto';
import { UpdateCellDto } from './dto/update-cell.dto';
export declare class CellsController {
    private readonly cellsService;
    constructor(cellsService: CellsService);
    create(createCellDto: CreateCellDto): Promise<import("./schemas/cell.schema").Cell>;
    findAllForUser(req: any): Promise<import("./schemas/cell.schema").Cell[]>;
    update(id: string, updateCellDto: UpdateCellDto): Promise<import("./schemas/cell.schema").Cell>;
    remove(id: string): Promise<any>;
}
