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
exports.CellsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const cell_schema_1 = require("./schemas/cell.schema");
const types_1 = require("../shared/types");
let CellsService = class CellsService {
    constructor(cellModel) {
        this.cellModel = cellModel;
    }
    async create(createCellDto) {
        const createdCell = new this.cellModel(createCellDto);
        return createdCell.save();
    }
    async findAllForUser(user) {
        if (!user) {
            return this.cellModel.find({}).exec();
        }
        const query = {};
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
        }
        return this.cellModel.find(query).exec();
    }
    async update(id, updateCellDto) {
        return this.cellModel.findByIdAndUpdate(id, updateCellDto, { new: true }).exec();
    }
    async remove(id) {
        return this.cellModel.findByIdAndDelete(id).exec();
    }
};
exports.CellsService = CellsService;
exports.CellsService = CellsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(cell_schema_1.Cell.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CellsService);
//# sourceMappingURL=cells.service.js.map