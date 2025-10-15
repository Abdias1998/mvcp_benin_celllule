import { Document, Schema as MongooseSchema } from 'mongoose';
import { InvitedPerson, Visit, PrayerRequest } from 'src/shared/types';
export type ReportDocument = Report & Document;
export declare class Report {
    id: string;
    cellDate: string;
    region: string;
    group: string;
    district: string;
    cellName: string;
    cellCategory: string;
    leaderName: string;
    leaderContact: string;
    registeredMen: number;
    registeredWomen: number;
    registeredChildren: number;
    attendees: number;
    absentees: number;
    invitedPeople: InvitedPerson[];
    totalPresent: number;
    visitSchedule: string;
    visitsMade: Visit[];
    bibleStudy: number;
    miracleHour: number;
    sundayServiceAttendance: number;
    evangelismOuting: string;
    poignantTestimony?: string;
    prayerRequests?: PrayerRequest[];
    message: string;
    submittedAt: string;
}
export declare const ReportSchema: MongooseSchema<Report, import("mongoose").Model<Report, any, any, any, Document<unknown, any, Report, any, {}> & Report & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Report, Document<unknown, {}, import("mongoose").FlatRecord<Report>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Report> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
