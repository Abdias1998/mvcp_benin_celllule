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
exports.SeederController = void 0;
const common_1 = require("@nestjs/common");
const seeder_service_1 = require("./seeder.service");
const config_1 = require("@nestjs/config");
let SeederController = class SeederController {
    constructor(seederService, configService) {
        this.seederService = seederService;
        this.configService = configService;
    }
    async seedDatabase(key) {
        const seederKey = this.configService.get('SEEDER_KEY');
        if (key !== seederKey) {
            throw new common_1.UnauthorizedException('Invalid seeder key.');
        }
        return this.seederService.seed();
    }
};
exports.SeederController = SeederController;
__decorate([
    (0, common_1.Post)('seed'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SeederController.prototype, "seedDatabase", null);
exports.SeederController = SeederController = __decorate([
    (0, common_1.Controller)('seeder'),
    __metadata("design:paramtypes", [seeder_service_1.SeederService,
        config_1.ConfigService])
], SeederController);
//# sourceMappingURL=seeder.controller.js.map