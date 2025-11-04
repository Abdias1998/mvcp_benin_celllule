import { CellLeadersService } from './cell-leaders.service';
import { CreateCellLeaderDto } from './dto/create-cell-leader.dto';
export declare class CellLeadersController {
    private readonly cellLeadersService;
    constructor(cellLeadersService: CellLeadersService);
    create(createCellLeaderDto: CreateCellLeaderDto, req: any): Promise<{
        identifier: string;
        user: import("mongoose").Document<unknown, {}, import("../users/schemas/user.schema").UserDocument, {}, {}> & import("../users/schemas/user.schema").User & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
}
