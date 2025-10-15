"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const group_schema_1 = require("./schemas/group.schema");
const district_schema_1 = require("../districts/schemas/district.schema");
const cell_schema_1 = require("../cells/schemas/cell.schema");
const report_schema_1 = require("../reports/schemas/report.schema");
const user_schema_1 = require("../users/schemas/user.schema");
let GroupsService = class GroupsService {
    constructor(groupModel, districtModel, cellModel, reportModel, userModel) {
        this.groupModel = groupModel;
        this.districtModel = districtModel;
        this.cellModel = cellModel;
        this.reportModel = reportModel;
        this.userModel = userModel;
    }
    async create(createGroupDto) {
        const existing = await this.groupModel.findOne({
            region: createGroupDto.region,
            name: { $regex: new RegExp(`^${createGroupDto.name}$`, 'i') }
        });
        if (existing) {
            throw new common_1.ConflictException("Un groupe avec ce nom existe déjà dans cette région.");
        }
        const createdGroup = new this.groupModel(createGroupDto);
        return createdGroup.save();
    }
    async findAll(region) {
        const query = region ? { region } : {};
        return this.groupModel.find(query).sort({ region: 1, name: 1 }).exec();
    }
    async update(id, updateGroupDto) {
        const oldGroup = await this.groupModel.findById(id);
        if (!oldGroup) {
            throw new common_1.NotFoundException("Groupe non trouvé.");
        }
        const { name: newGroupName, region: newRegion } = updateGroupDto;
        const { name: oldGroupName, region: oldRegion } = oldGroup;
        if (newGroupName && (newGroupName !== oldGroupName || newRegion !== oldRegion)) {
            await this.districtModel.updateMany({ region: oldRegion, group: oldGroupName }, { $set: { group: newGroupName, region: newRegion } });
            await this.cellModel.updateMany({ region: oldRegion, group: oldGroupName }, { $set: { group: newGroupName, region: newRegion } });
            await this.reportModel.updateMany({ region: oldRegion, group: oldGroupName }, { $set: { group: newGroupName, region: newRegion } });
            await this.userModel.updateMany({ region: oldRegion, group: oldGroupName }, { $set: { group: newGroupName, region: newRegion } });
        }
        return this.groupModel.findByIdAndUpdate(id, updateGroupDto, { new: true }).exec();
    }
    async remove(id) {
        const groupToDelete = await this.groupModel.findById(id);
        if (!groupToDelete) {
            throw new common_1.NotFoundException("Groupe non trouvé.");
        }
        const childDistricts = await this.districtModel.countDocuments({ region: groupToDelete.region, group: groupToDelete.name });
        if (childDistricts > 0) {
            throw new common_1.BadRequestException("Impossible de supprimer ce groupe car il contient des districts.");
        }
        return this.groupModel.findByIdAndDelete(id).exec();
    }
};
exports.GroupsService = GroupsService;
exports.GroupsService = GroupsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(group_schema_1.Group.name)),
    __param(1, (0, mongoose_1.InjectModel)(district_schema_1.District.name)),
    __param(2, (0, mongoose_1.InjectModel)(cell_schema_1.Cell.name)),
    __param(3, (0, mongoose_1.InjectModel)(report_schema_1.Report.name)),
    __param(4, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], GroupsService);
//# sourceMappingURL=groups.service.js.map