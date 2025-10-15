import { Document } from 'mongoose';
export type DistrictDocument = District & Document;
export declare class District {
    id: string;
    region: string;
    group: string;
    name: string;
}
export declare const DistrictSchema: import("mongoose").Schema<District, import("mongoose").Model<District, any, any, any, Document<unknown, any, District, any, {}> & District & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, District, Document<unknown, {}, import("mongoose").FlatRecord<District>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<District> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
