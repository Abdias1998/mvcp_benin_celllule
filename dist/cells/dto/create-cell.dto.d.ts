import { CellStatus } from '../../shared/types';
export declare class CreateCellDto {
    region: string;
    group: string;
    district: string;
    cellName?: string;
    cellCategory: string;
    leaderName: string;
    leaderContact?: string;
    status: CellStatus;
}
