import { Document } from 'mongoose';
import { UserRole } from '../../shared/types';
export type UserDocument = User & Document;
export declare class User {
    uid: string;
    email?: string;
    name: string;
    role: UserRole;
    region?: string;
    group?: string;
    district?: string;
    cellName?: string;
    cellCategory?: string;
    status?: 'pending' | 'approved';
    password?: string;
    contact?: string;
    identifier?: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any, {}> & User & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<User> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
