import { UserRole } from '../../shared/types';
export declare class RegisterDto {
    name: string;
    email: string;
    password: string;
    contact?: string;
    role: UserRole;
    region: string;
    group?: string;
    district?: string;
}
