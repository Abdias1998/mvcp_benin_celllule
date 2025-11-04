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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const report_schema_1 = require("./schemas/report.schema");
const types_1 = require("../shared/types");
let ReportsService = class ReportsService {
    constructor(reportModel) {
        this.reportModel = reportModel;
    }
    async create(createReportDto) {
        const newReport = new this.reportModel({
            ...createReportDto,
            submittedAt: new Date().toISOString(),
        });
        return newReport.save();
    }
    async findAll(user, dateRange) {
        const query = {
            cellDate: {
                $gte: dateRange.start,
                $lte: dateRange.end,
            },
        };
        console.log('🔍 [REPORTS SERVICE] Utilisateur:', {
            role: user.role,
            name: user.name,
            region: user.region,
            group: user.group,
            district: user.district,
        });
        switch (user.role) {
            case types_1.UserRole.REGIONAL_PASTOR:
                query.region = user.region;
                break;
            case types_1.UserRole.GROUP_PASTOR:
                query.region = user.region;
                query.group = user.group;
                break;
            case types_1.UserRole.DISTRICT_PASTOR:
                query.region = user.region;
                query.group = user.group;
                query.district = user.district;
                break;
            case types_1.UserRole.CELL_LEADER:
                query.region = user.region;
                query.group = user.group;
                query.district = user.district;
                query.cellName = user.cellName;
                query.cellCategory = user.cellCategory;
                break;
            case types_1.UserRole.NATIONAL_COORDINATOR:
            default:
                break;
        }
        console.log('🔍 [REPORTS SERVICE] Query MongoDB:', JSON.stringify(query, null, 2));
        const results = await this.reportModel
            .find(query)
            .sort({ submittedAt: -1 })
            .exec();
        console.log('🔍 [REPORTS SERVICE] Nombre de rapports trouvés:', results.length);
        if (results.length > 0) {
            console.log('🔍 [REPORTS SERVICE] Premier rapport:', {
                region: results[0].region,
                group: results[0].group,
                district: results[0].district,
                cellName: results[0].cellName,
            });
        }
        return results;
    }
    async remove(id) {
        return this.reportModel.findByIdAndDelete(id).exec();
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(report_schema_1.Report.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ReportsService);
//# sourceMappingURL=reports.service.js.map