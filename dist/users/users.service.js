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
const cell_schema_1 = require("../cells/schemas/cell.schema");
const types_1 = require("../shared/types");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    constructor(userModel, cellModel) {
        this.userModel = userModel;
        this.cellModel = cellModel;
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
        const enrichedResults = await Promise.all(results.map(async (user) => {
            const userObj = user.toObject();
            if (user.role === types_1.UserRole.CELL_LEADER) {
                console.log(`🔍 Processing CELL_LEADER: ${user.name}`);
                console.log(`   - cellName: ${user.cellName}`);
                console.log(`   - region: ${user.region}, group: ${user.group}, district: ${user.district}`);
                console.log(`   - cellCategory: ${user.cellCategory}`);
                if (user.cellName) {
                    const cell = await this.cellModel.findOne({
                        region: user.region,
                        group: user.group,
                        district: user.district,
                        cellName: user.cellName,
                        cellCategory: user.cellCategory
                    }).exec();
                    if (cell) {
                        console.log(`✅ Found cell with initialMembersCount: ${cell.initialMembersCount}`);
                        userObj.initialMembersCount = cell.initialMembersCount || 0;
                    }
                    else {
                        console.log(`❌ Cell not found for ${user.name}`);
                        console.log(`   Query was: region=${user.region}, group=${user.group}, district=${user.district}, cellName=${user.cellName}, cellCategory=${user.cellCategory}`);
                    }
                }
                else {
                    console.log(`⚠️  CELL_LEADER ${user.name} has no cellName defined!`);
                }
            }
            return userObj;
        }));
        console.log(`🔍 Returning ${enrichedResults.length} enriched users`);
        return enrichedResults;
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
    async reassignUser(reassignDto) {
        const { userId, newRole, newRegion, newGroup, newDistrict } = reassignDto;
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }
        console.log('🔄 Réaffectation de l\'utilisateur:', {
            userId,
            currentRole: user.role,
            currentRegion: user.region,
            currentGroup: user.group,
            currentDistrict: user.district,
            newRole,
            newRegion,
            newGroup,
            newDistrict
        });
        const oldRegion = user.region;
        const oldGroup = user.group;
        const oldDistrict = user.district;
        const oldRole = user.role;
        const updateData = {};
        if (newRole !== undefined)
            updateData.role = newRole;
        if (newRegion !== undefined)
            updateData.region = newRegion;
        if (newGroup !== undefined)
            updateData.group = newGroup;
        if (newDistrict !== undefined)
            updateData.district = newDistrict;
        const updatedUser = await this.userModel.findByIdAndUpdate(userId, updateData, { new: true }).select('-password').exec();
        console.log('✅ Utilisateur mis à jour:', {
            name: updatedUser.name,
            role: updatedUser.role,
            region: updatedUser.region,
            group: updatedUser.group,
            district: updatedUser.district
        });
        let cellsUpdated = 0;
        if (oldRole === types_1.UserRole.GROUP_PASTOR || newRole === types_1.UserRole.GROUP_PASTOR) {
            const cellQuery = {
                region: oldRegion,
                group: oldGroup
            };
            const cellUpdateData = {};
            if (newRegion !== undefined)
                cellUpdateData.region = newRegion;
            if (newGroup !== undefined)
                cellUpdateData.group = newGroup;
            const cellsResult = await this.cellModel.updateMany(cellQuery, { $set: cellUpdateData }).exec();
            cellsUpdated = cellsResult.modifiedCount;
            console.log(`✅ ${cellsUpdated} cellule(s) mise(s) à jour pour le groupe`);
        }
        else if (oldRole === types_1.UserRole.DISTRICT_PASTOR || newRole === types_1.UserRole.DISTRICT_PASTOR) {
            const cellQuery = {
                region: oldRegion,
                group: oldGroup,
                district: oldDistrict
            };
            const cellUpdateData = {};
            if (newRegion !== undefined)
                cellUpdateData.region = newRegion;
            if (newGroup !== undefined)
                cellUpdateData.group = newGroup;
            if (newDistrict !== undefined)
                cellUpdateData.district = newDistrict;
            const cellsResult = await this.cellModel.updateMany(cellQuery, { $set: cellUpdateData }).exec();
            cellsUpdated = cellsResult.modifiedCount;
            console.log(`✅ ${cellsUpdated} cellule(s) mise(s) à jour pour le district`);
        }
        else if (oldRole === types_1.UserRole.CELL_LEADER) {
            const cellQuery = {
                region: oldRegion,
                group: oldGroup,
                district: oldDistrict,
                cellName: user.cellName,
                cellCategory: user.cellCategory
            };
            const cellUpdateData = {};
            if (newRegion !== undefined)
                cellUpdateData.region = newRegion;
            if (newGroup !== undefined)
                cellUpdateData.group = newGroup;
            if (newDistrict !== undefined)
                cellUpdateData.district = newDistrict;
            const cellsResult = await this.cellModel.updateMany(cellQuery, { $set: cellUpdateData }).exec();
            cellsUpdated = cellsResult.modifiedCount;
            console.log(`✅ ${cellsUpdated} cellule(s) mise(s) à jour pour le responsable`);
        }
        return {
            success: true,
            message: 'Réaffectation effectuée avec succès',
            user: updatedUser,
            cellsUpdated,
            details: {
                oldHierarchy: {
                    role: oldRole,
                    region: oldRegion,
                    group: oldGroup,
                    district: oldDistrict
                },
                newHierarchy: {
                    role: updatedUser.role,
                    region: updatedUser.region,
                    group: updatedUser.group,
                    district: updatedUser.district
                }
            }
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(cell_schema_1.Cell.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map