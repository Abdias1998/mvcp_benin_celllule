import { Model } from 'mongoose';
import { Report, ReportDocument } from './schemas/report.schema';
import { CreateReportDto } from './dto/create-report.dto';
import { User } from 'src/shared/types';
export declare class ReportsService {
    private reportModel;
    constructor(reportModel: Model<ReportDocument>);
    create(createReportDto: CreateReportDto): Promise<Report>;
    findAll(user: User, dateRange: {
        start: string;
        end: string;
    }): Promise<Report[]>;
    remove(id: string): Promise<any>;
}
