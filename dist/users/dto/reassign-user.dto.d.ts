import { UserRole } from '../../shared/types';
export declare class ReassignUserDto {
    userId: string;
    newRole?: UserRole;
    newRegion?: string;
    newGroup?: string;
    newDistrict?: string;
}
