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
exports.CellLeadersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../users/schemas/user.schema");
const types_1 = require("../shared/types");
const bcrypt = require("bcrypt");
let CellLeadersService = class CellLeadersService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async create(createCellLeaderDto, currentUser) {
        const identifier = await this.generateUniqueIdentifier();
        const hashedPassword = await bcrypt.hash(identifier, 10);
        const cellLeader = new this.userModel({
            name: createCellLeaderDto.name,
            contact: createCellLeaderDto.contact,
            region: createCellLeaderDto.region,
            group: createCellLeaderDto.group,
            district: createCellLeaderDto.district,
            cellName: createCellLeaderDto.cellName,
            cellCategory: createCellLeaderDto.cellCategory,
            role: types_1.UserRole.CELL_LEADER,
            identifier: identifier,
            status: 'approved',
            password: hashedPassword,
            uid: `cell-leader-${Date.now()}`
        });
        const savedCellLeader = await cellLeader.save();
        return {
            identifier: identifier,
            user: savedCellLeader
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
};
exports.CellLeadersService = CellLeadersService;
exports.CellLeadersService = CellLeadersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CellLeadersService);
//# sourceMappingURL=cell-leaders.service.js.map