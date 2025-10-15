import { Model } from 'mongoose';
import { UserDocument } from '../users/schemas/user.schema';
import { ReportDocument } from '../reports/schemas/report.schema';
import { CellDocument } from '../cells/schemas/cell.schema';
import { GroupDocument } from '../groups/schemas/group.schema';
import { DistrictDocument } from '../districts/schemas/district.schema';
export declare class SeederService {
    private userModel;
    private reportModel;
    private cellModel;
    private groupModel;
    private districtModel;
    private readonly logger;
    constructor(userModel: Model<UserDocument>, reportModel: Model<ReportDocument>, cellModel: Model<CellDocument>, groupModel: Model<GroupDocument>, districtModel: Model<DistrictDocument>);
    seed(): Promise<{
        message: string;
    }>;
    private generateData;
}
