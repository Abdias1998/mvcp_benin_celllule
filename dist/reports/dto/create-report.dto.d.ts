declare class InvitedPersonDto {
    name: string;
    contact: string;
    address: string;
}
declare class VisitDto {
    name: string;
    subject: string;
    need: string;
}
declare class PrayerRequestDto {
    subject: string;
    isAnonymous: boolean;
}
export declare class CreateReportDto {
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
    totalPresent: number;
    invitedPeople: InvitedPersonDto[];
    visitSchedule: string;
    visitsMade: VisitDto[];
    bibleStudy: number;
    miracleHour: number;
    sundayServiceAttendance: number;
    evangelismOuting: string;
    poignantTestimony?: string;
    prayerRequests?: PrayerRequestDto[];
    message: string;
}
export {};
