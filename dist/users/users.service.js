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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./schemas/user.schema");
const types_1 = require("../shared/types");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async findByEmail(email) {
        return this.userModel.findOne({ email: email.toLowerCase() }).exec();
    }
    async findByContact(contact) {
        return this.userModel.findOne({ contact }).exec();
    }
    async findByEmailOrContact(identifier) {
        if (identifier.includes('@')) {
            return this.findByEmail(identifier);
        }
        return this.findByContact(identifier);
    }
    async findById(id) {
        return this.userModel.findById(id).exec();
    }
    async create(createPastorDto) {
        const hashedPassword = await bcrypt.hash(createPastorDto.password, 10);
        const createdUser = new this.userModel({
            ...createPastorDto,
            password: hashedPassword,
            uid: `user-${Date.now()}`
        });
        return createdUser.save();
    }
    async getPendingPastors() {
        return this.userModel.find({ status: 'pending' }).exec();
    }
    async getPastors() {
        return this.userModel.find({
            status: 'approved',
            role: { $ne: types_1.UserRole.NATIONAL_COORDINATOR }
        }).exec();
    }
    async approvePastor(id) {
        return this.userModel.findByIdAndUpdate(id, { status: 'approved' }, { new: true }).exec();
    }
    async update(id, updatePastorDto) {
        const { password, ...dataToUpdate } = updatePastorDto;
        return this.userModel.findByIdAndUpdate(id, dataToUpdate, { new: true }).exec();
    }
    async delete(id) {
        return this.userModel.findByIdAndDelete(id).exec();
    }
    async getUsersByHierarchy(currentUser) {
        const query = { status: 'approved' };
        console.log('🔍 getUsersByHierarchy - Current User:', {
            role: currentUser.role,
            region: currentUser.region,
            group: currentUser.group,
            district: currentUser.district
        });
        if (currentUser.role === types_1.UserRole.REGIONAL_PASTOR) {
            query.$or = [
                {
                    role: types_1.UserRole.GROUP_PASTOR,
                    region: currentUser.region
                },
                {
                    role: types_1.UserRole.DISTRICT_PASTOR,
                    region: currentUser.region
                },
                {
                    role: types_1.UserRole.CELL_LEADER,
                    region: currentUser.region
                }
            ];
        }
        else if (currentUser.role === types_1.UserRole.GROUP_PASTOR) {
            query.$or = [
                {
                    role: types_1.UserRole.DISTRICT_PASTOR,
                    region: currentUser.region,
                    group: currentUser.group
                },
                {
                    role: types_1.UserRole.CELL_LEADER,
                    region: currentUser.region,
                    group: currentUser.group
                }
            ];
        }
        else if (currentUser.role === types_1.UserRole.DISTRICT_PASTOR) {
            query.role = types_1.UserRole.CELL_LEADER;
            query.region = currentUser.region;
            query.group = currentUser.group;
            query.district = currentUser.district;
        }
        else {
            return [];
        }
        console.log('🔍 Query:', JSON.stringify(query, null, 2));
        const results = await this.userModel.find(query).select('-password').exec();
        console.log(`🔍 Found ${results.length} users`);
        results.forEach(u => {
            console.log(`  - ${u.name} (${u.role}) - Region: ${u.region}, Group: ${u.group}, District: ${u.district}`);
        });
        return results;
    }
    async updateResetToken(userId, token, expires) {
        await this.userModel.findByIdAndUpdate(userId, {
            resetPasswordToken: token,
            resetPasswordExpires: expires,
        }).exec();
    }
    async findByResetToken(token) {
        return this.userModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() },
        }).exec();
    }
    async updatePassword(userId, hashedPassword) {
        await this.userModel.findByIdAndUpdate(userId, {
            password: hashedPassword,
            resetPasswordToken: undefined,
            resetPasswordExpires: undefined,
        }).exec();
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map