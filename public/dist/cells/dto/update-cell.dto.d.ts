import { CellStatus } from '../../shared/types';
export declare class UpdateCellDto {
    region?: string;
    group?: string;
    district?: string;
    cellName?: string;
    cellCategory?: string;
    leaderName?: string;
    leaderContact?: string;
    status?: CellStatus;
}
