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
exports.DistrictsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const district_schema_1 = require("./schemas/district.schema");
const cell_schema_1 = require("../cells/schemas/cell.schema");
let DistrictsService = class DistrictsService {
    constructor(districtModel, cellModel) {
        this.districtModel = districtModel;
        this.cellModel = cellModel;
    }
    async create(createDistrictDto) {
        const createdDistrict = new this.districtModel(createDistrictDto);
        return createdDistrict.save();
    }
    async findAll() {
        return this.districtModel.find().sort({ region: 1, group: 1, name: 1 }).exec();
    }
    async update(id, updateDistrictDto) {
        return this.districtModel.findByIdAndUpdate(id, updateDistrictDto, { new: true }).exec();
    }
    async remove(id) {
        const districtToDelete = await this.districtModel.findById(id);
        if (!districtToDelete) {
            throw new common_1.NotFoundException("District non trouvé.");
        }
        const childCells = await this.cellModel.countDocuments({
            region: districtToDelete.region,
            group: districtToDelete.group,
            district: districtToDelete.name,
        });
        if (childCells > 0) {
            throw new common_1.BadRequestException("Impossible de supprimer ce district car il contient des cellules de maison.");
        }
        return this.districtModel.findByIdAndDelete(id).exec();
    }
};
exports.DistrictsService = DistrictsService;
exports.DistrictsService = DistrictsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(district_schema_1.District.name)),
    __param(1, (0, mongoose_1.InjectModel)(cell_schema_1.Cell.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], DistrictsService);
//# sourceMappingURL=districts.service.js.map