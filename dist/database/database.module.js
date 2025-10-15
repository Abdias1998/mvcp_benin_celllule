"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const seeder_service_1 = require("./seeder.service");
const seeder_controller_1 = require("./seeder.controller");
const user_schema_1 = require("../users/schemas/user.schema");
const report_schema_1 = require("../reports/schemas/report.schema");
const cell_schema_1 = require("../cells/schemas/cell.schema");
const group_schema_1 = require("../groups/schemas/group.schema");
const district_schema_1 = require("../districts/schemas/district.schema");
const config_1 = require("@nestjs/config");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: report_schema_1.Report.name, schema: report_schema_1.ReportSchema },
                { name: cell_schema_1.Cell.name, schema: cell_schema_1.CellSchema },
                { name: group_schema_1.Group.name, schema: group_schema_1.GroupSchema },
                { name: district_schema_1.District.name, schema: district_schema_1.DistrictSchema },
            ]),
        ],
        providers: [seeder_service_1.SeederService],
        controllers: [seeder_controller_1.SeederController],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map