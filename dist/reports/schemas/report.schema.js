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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportSchema = exports.Report = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let InvitedPersonSchema = class InvitedPersonSchema {
};
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], InvitedPersonSchema.prototype, "id", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], InvitedPersonSchema.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], InvitedPersonSchema.prototype, "contact", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], InvitedPersonSchema.prototype, "address", void 0);
InvitedPersonSchema = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], InvitedPersonSchema);
let VisitSchema = class VisitSchema {
};
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], VisitSchema.prototype, "id", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], VisitSchema.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], VisitSchema.prototype, "subject", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], VisitSchema.prototype, "need", void 0);
VisitSchema = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], VisitSchema);
let PrayerRequestSchema = class PrayerRequestSchema {
};
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PrayerRequestSchema.prototype, "id", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PrayerRequestSchema.prototype, "subject", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Boolean)
], PrayerRequestSchema.prototype, "isAnonymous", void 0);
PrayerRequestSchema = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], PrayerRequestSchema);
let Report = class Report {
};
exports.Report = Report;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Report.prototype, "id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Report.prototype, "cellDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Report.prototype, "region", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Report.prototype, "group", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Report.prototype, "district", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Report.prototype, "cellName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Report.prototype, "cellCategory", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Report.prototype, "leaderName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Report.prototype, "leaderContact", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], Report.prototype, "registeredMen", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], Report.prototype, "registeredWomen", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], Report.prototype, "registeredChildren", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], Report.prototype, "attendees", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], Report.prototype, "absentees", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [InvitedPersonSchema], default: [] }),
    __metadata("design:type", Array)
], Report.prototype, "invitedPeople", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], Report.prototype, "totalPresent", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Report.prototype, "visitSchedule", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [VisitSchema], default: [] }),
    __metadata("design:type", Array)
], Report.prototype, "visitsMade", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], Report.prototype, "bibleStudy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], Report.prototype, "miracleHour", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], Report.prototype, "sundayServiceAttendance", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Report.prototype, "evangelismOuting", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Report.prototype, "poignantTestimony", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [PrayerRequestSchema], default: [] }),
    __metadata("design:type", Array)
], Report.prototype, "prayerRequests", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Report.prototype, "message", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Report.prototype, "submittedAt", void 0);
exports.Report = Report = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            },
        },
    })
], Report);
exports.ReportSchema = mongoose_1.SchemaFactory.createForClass(Report);
//# sourceMappingURL=report.schema.js.map