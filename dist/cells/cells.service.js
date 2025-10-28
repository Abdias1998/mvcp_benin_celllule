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
const user_schema_1 = require("../users/schemas/user.schema");
const bcrypt = require("bcrypt");
let CellsService = class CellsService {
    constructor(cellModel, userModel) {
        this.cellModel = cellModel;
        this.userModel = userModel;
    }
    async create(createCellDto) {
        const createdCell = new this.cellModel(createCellDto);
        const savedCell = await createdCell.save();
        const identifier = await this.generateUniqueIdentifier();
        const hashedPassword = await bcrypt.hash(identifier, 10);
        const cellLeader = new this.userModel({
            name: createCellDto.leaderName,
            contact: createCellDto.leaderContact,
            region: createCellDto.region,
            group: createCellDto.group,
            district: createCellDto.district,
            cellName: createCellDto.cellName,
            cellCategory: createCellDto.cellCategory,
            role: types_1.UserRole.CELL_LEADER,
            identifier: identifier,
            status: 'approved',
            password: hashedPassword,
            uid: `cell-leader-${Date.now()}`
        });
        await cellLeader.save();
        return {
            cell: savedCell,
            leaderIdentifier: identifier
        };
    }
    async generateUniqueIdentifier() {
        let identifier;
        let exists = true;
        while (exists) {
            identifier = Math.floor(10000 + Math.random() * 90000).toString();
            const existingUser = await this.userModel.findOne({ identifier }).exec();
            exists = !!existingUser;
        }
        return identifier;
    }
    async findAllForUser(user) {
        const query = {};
        if (user) {
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
        }
        const cells = await this.cellModel.find(query).exec();
        const cellsWithIdentifier = await Promise.all(cells.map(async (cell) => {
            const cellObj = cell.toObject();
            const leader = await this.userModel.findOne({
                role: types_1.UserRole.CELL_LEADER,
                cellName: cell.cellName,
                cellCategory: cell.cellCategory,
                region: cell.region,
                group: cell.group,
                district: cell.district,
            }).exec();
            return {
                ...cellObj,
                leaderIdentifier: leader?.identifier || null,
            };
        }));
        return cellsWithIdentifier;
    }
    async update(id, updateCellDto) {
        const currentCell = await this.cellModel.findById(id).exec();
        if (!currentCell) {
            throw new Error('Cellule non trouvée');
        }
        const updatedCell = await this.cellModel.findByIdAndUpdate(id, updateCellDto, { new: true }).exec();
        if (updateCellDto.leaderName || updateCellDto.leaderContact) {
            const currentLeader = await this.userModel.findOne({
                role: types_1.UserRole.CELL_LEADER,
                cellName: currentCell.cellName,
                cellCategory: currentCell.cellCategory,
                region: currentCell.region,
                group: currentCell.group,
                district: currentCell.district,
            }).exec();
            if (currentLeader) {
                const updateData = {};
                if (updateCellDto.leaderName && updateCellDto.leaderName !== currentLeader.name) {
                    updateData.name = updateCellDto.leaderName;
                }
                if (updateCellDto.leaderContact && updateCellDto.leaderContact !== currentLeader.contact) {
                    updateData.contact = updateCellDto.leaderContact;
                }
                if (Object.keys(updateData).length > 0) {
                    await this.userModel.findByIdAndUpdate(currentLeader._id, updateData).exec();
                }
            }
        }
        return updatedCell;
    }
    async remove(id) {
        return this.cellModel.findByIdAndDelete(id).exec();
    }
};
exports.CellsService = CellsService;
exports.CellsService = CellsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(cell_schema_1.Cell.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], CellsService);
//# sourceMappingURL=cells.service.js.map