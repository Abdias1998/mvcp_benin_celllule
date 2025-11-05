"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const groups_service_1 = require("./groups.service");
const groups_controller_1 = require("./groups.controller");
const group_schema_1 = require("./schemas/group.schema");
const district_schema_1 = require("../districts/schemas/district.schema");
const cell_schema_1 = require("../cells/schemas/cell.schema");
const report_schema_1 = require("../reports/schemas/report.schema");
const user_schema_1 = require("../users/schemas/user.schema");
let GroupsModule = class GroupsModule {
};
exports.GroupsModule = GroupsModule;
exports.GroupsModule = GroupsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: group_schema_1.Group.name, schema: group_schema_1.GroupSchema },
                { name: district_schema_1.District.name, schema: district_schema_1.DistrictSchema },
                { name: cell_schema_1.Cell.name, schema: cell_schema_1.CellSchema },
                { name: report_schema_1.Report.name, schema: report_schema_1.ReportSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
            ]),
        ],
        controllers: [groups_controller_1.GroupsController],
        providers: [groups_service_1.GroupsService],
    })
], GroupsModule);
//# sourceMappingURL=groups.module.js.map