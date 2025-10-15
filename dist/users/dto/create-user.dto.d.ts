import { UserRole } from '../../shared/types';
export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    contact?: string;
    region?: string;
    group?: string;
    district?: string;
}
