import { Model } from 'mongoose';
import { Group, GroupDocument } from './schemas/group.schema';
import { DistrictDocument } from '../districts/schemas/district.schema';
import { CellDocument } from '../cells/schemas/cell.schema';
import { ReportDocument } from '../reports/schemas/report.schema';
import { UserDocument } from '../users/schemas/user.schema';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
export declare class GroupsService {
    private groupModel;
    private districtModel;
    private cellModel;
    private reportModel;
    private userModel;
    constructor(groupModel: Model<GroupDocument>, districtModel: Model<DistrictDocument>, cellModel: Model<CellDocument>, reportModel: Model<ReportDocument>, userModel: Model<UserDocument>);
    create(createGroupDto: CreateGroupDto): Promise<Group>;
    findAll(region?: string): Promise<Group[]>;
    update(id: string, updateGroupDto: UpdateGroupDto): Promise<Group>;
    remove(id: string): Promise<any>;
}
