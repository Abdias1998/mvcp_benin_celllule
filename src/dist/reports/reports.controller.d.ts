import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    create(createReportDto: CreateReportDto): Promise<import("./schemas/report.schema").Report>;
    findAll(req: any, start: string, end: string): Promise<import("./schemas/report.schema").Report[]>;
    remove(id: string): Promise<any>;
}
