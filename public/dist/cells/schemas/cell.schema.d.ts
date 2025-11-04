import { Document } from 'mongoose';
import { CellStatus } from 'src/shared/types';
export type CellDocument = Cell & Document;
export declare class Cell {
    id: string;
    region: string;
    group: string;
    district: string;
    cellName: string;
    cellCategory: string;
    leaderName: string;
    leaderContact?: string;
    status: CellStatus;
    initialMembersCount?: number;
}
export declare const CellSchema: import("mongoose").Schema<Cell, import("mongoose").Model<Cell, any, any, any, Document<unknown, any, Cell, any, {}> & Cell & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Cell, Document<unknown, {}, import("mongoose").FlatRecord<Cell>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Cell> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
