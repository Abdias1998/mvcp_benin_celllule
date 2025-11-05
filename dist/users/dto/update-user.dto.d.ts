import { UserRole } from '../../shared/types';
export declare class UpdateUserDto {
    name?: string;
    email?: string;
    contact?: string;
    role?: UserRole;
    region?: string;
    group?: string;
    district?: string;
}
