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
var SeederService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeederService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcrypt");
const user_schema_1 = require("../users/schemas/user.schema");
const report_schema_1 = require("../reports/schemas/report.schema");
const cell_schema_1 = require("../cells/schemas/cell.schema");
const group_schema_1 = require("../groups/schemas/group.schema");
const district_schema_1 = require("../districts/schemas/district.schema");
const types_1 = require("../shared/types");
const constants_1 = require("../shared/constants");
let SeederService = SeederService_1 = class SeederService {
    constructor(userModel, reportModel, cellModel, groupModel, districtModel) {
        this.userModel = userModel;
        this.reportModel = reportModel;
        this.cellModel = cellModel;
        this.groupModel = groupModel;
        this.districtModel = districtModel;
        this.logger = new common_1.Logger(SeederService_1.name);
    }
    async seed() {
        const userCount = await this.userModel.countDocuments();
        if (userCount > 0) {
            this.logger.warn('Database is not empty. Seeding aborted.');
            return { message: 'Database already contains data. Seeding aborted.' };
        }
        this.logger.log('Starting database seed...');
        const { users, groups, districts, cells, reports } = await this.generateData();
        await this.userModel.insertMany(users);
        this.logger.log(`${users.length} users seeded.`);
        await this.groupModel.insertMany(groups);
        this.logger.log(`${groups.length} groups seeded.`);
        await this.districtModel.insertMany(districts);
        this.logger.log(`${districts.length} districts seeded.`);
        await this.cellModel.insertMany(cells);
        this.logger.log(`${cells.length} cells seeded.`);
        await this.reportModel.insertMany(reports);
        this.logger.log(`${reports.length} reports seeded.`);
        this.logger.log('Database seeding completed successfully.');
        return { message: 'Database seeded successfully!' };
    }
    async generateData() {
        const hashedPassword = await bcrypt.hash('GOD@2020', 10);
        const adminPassword = await bcrypt.hash('password123', 10);
        const MOCK_ADMIN_USER = {
            email: 'adoris.ye@gmail.com',
            name: 'Adoris YE',
            role: types_1.UserRole.NATIONAL_COORDINATOR,
            status: 'approved',
            password: hashedPassword,
        };
        const users = [MOCK_ADMIN_USER];
        const groups = [];
        const districts = [];
        const cells = [];
        const reports = [];
        const events = [];
        const communications = [];
        const generatePhoneNumber = () => `01${String(Math.floor(Math.random() * 90000000) + 10000000)}`;
        const cellStatuses = ['Active', 'En implantation', 'En multiplication', 'En pause'];
        constants_1.REGIONS.forEach(region => {
            const isLittoral = region === "Littoral";
            const groupLevelNames = isLittoral
                ? ["Alpha", "Omega", "Bethel", "Silo"].slice(0, Math.floor(Math.random() * 3) + 2)
                : [`District de ${region} I`, `District de ${region} II`];
            users.push({
                email: `${region.toLowerCase().replace(/\s/g, '')}@mvcp.org`, name: `Pasteur ${region}`,
                role: types_1.UserRole.REGIONAL_PASTOR, region: region, status: 'approved', password: adminPassword,
                contact: generatePhoneNumber()
            });
            groupLevelNames.forEach(groupName => {
                const group = { region, name: groupName };
                groups.push(group);
                users.push({
                    email: `${region.substring(0, 3).toLowerCase()}${groupName.toLowerCase().replace(/\s/g, '')}@mvcp.org`, name: `Pasteur ${groupName}`,
                    role: types_1.UserRole.GROUP_PASTOR, region: region, group: groupName, status: 'approved', password: adminPassword,
                    contact: generatePhoneNumber()
                });
                const districtNames = isLittoral
                    ? ["Centre", "Est", "Ouest", "Sud"].slice(0, Math.floor(Math.random() * 2) + 2)
                    : ["Localité A", "Localité B", "Localité C"].slice(0, Math.floor(Math.random() * 2) + 2);
                districtNames.forEach(districtName => {
                    const fullDistrictName = isLittoral ? `${districtName} ${groupName}` : districtName;
                    const district = { region, group: groupName, name: fullDistrictName };
                    districts.push(district);
                    users.push({
                        email: `${fullDistrictName.toLowerCase().replace(/\s/g, '')}@mvcp.org`, name: `Pasteur ${fullDistrictName}`,
                        role: types_1.UserRole.DISTRICT_PASTOR, region: region, group: groupName, district: fullDistrictName, status: 'approved', password: adminPassword,
                        contact: generatePhoneNumber()
                    });
                    for (let i = 0; i < (Math.floor(Math.random() * 3) + 2); i++) {
                        const cellNames = ["Source de Vie", "Phare Divin", "Les Vainqueurs", "Etoile du Matin", "Rocher des Siècles"];
                        const leaders = ["Jean Akpo", "Grace Houessou", "David Abalo", "Esther Dossou", "Paul Zinsou"];
                        const cell = {
                            region, group: groupName, district: fullDistrictName,
                            cellName: `${cellNames[Math.floor(Math.random() * cellNames.length)]} ${i + 1}`,
                            cellCategory: constants_1.CELL_CATEGORIES[Math.floor(Math.random() * constants_1.CELL_CATEGORIES.length)],
                            leaderName: leaders[Math.floor(Math.random() * leaders.length)],
                            leaderContact: generatePhoneNumber(),
                            status: cellStatuses[Math.floor(Math.random() * cellStatuses.length)],
                        };
                        cells.push(cell);
                    }
                });
            });
        });
        const today = new Date();
        const testimonies = [
            "Témoignage de guérison miraculeuse après une prière intense.", "Une bénédiction financière inattendue a permis de payer les frais de scolarité.",
            "Réconciliation familiale grâce à la parole partagée en cellule.", "Un membre a trouvé un nouvel emploi après intercession.",
            "Le Seigneur a protégé une famille d'un grave accident."
        ];
        const decliningRegions = ["Mono", "Zou", "Atacora"];
        const growingRegions = ["Littoral", "Atlantique sud", "Borgou"];
        const stagnatingRegions = ["Couffo", "Plateau"];
        let reportIdCounter = 1;
        cells.forEach(cell => {
            const totalReportsToGenerate = 12;
            for (let i = 0; i < totalReportsToGenerate; i++) {
                const reportDate = new Date(today);
                reportDate.setDate(today.getDate() - (i * 7 + Math.floor(Math.random() * 3)));
                const registeredMen = Math.floor(Math.random() * 10) + 5;
                const registeredWomen = Math.floor(Math.random() * 12) + 8;
                const registeredChildren = Math.floor(Math.random() * 15) + 3;
                const totalRegistered = registeredMen + registeredWomen + registeredChildren;
                let baseAttendees = Math.floor(Math.random() * (totalRegistered * 0.8)) + Math.floor(totalRegistered * 0.1);
                let invitedPeopleCount = Math.floor(Math.random() * 4);
                if (decliningRegions.includes(cell.region)) {
                    baseAttendees -= Math.floor((totalReportsToGenerate - i) / 2.5);
                    if (i < 5)
                        invitedPeopleCount = 0;
                }
                else if (growingRegions.includes(cell.region)) {
                    baseAttendees += Math.floor((totalReportsToGenerate - i) / 2);
                    if (i < 5)
                        invitedPeopleCount = Math.floor(Math.random() * 2) + 1;
                }
                else if (stagnatingRegions.includes(cell.region)) {
                    if (i < 5)
                        invitedPeopleCount = 0;
                }
                else {
                    baseAttendees += Math.floor((totalReportsToGenerate - i) / 4);
                }
                const attendees = Math.max(3, Math.min(totalRegistered, baseAttendees));
                const absentees = totalRegistered - attendees;
                const invitedPeople = Array.from({ length: invitedPeopleCount }, (_, k) => ({
                    id: `invited-${reportIdCounter}-${k}`, name: `Invité ${k + 1}`, contact: generatePhoneNumber(), address: `Quartier ${k + 1}`
                }));
                const visitsMadeCount = Math.floor(Math.random() * 3);
                const visitsMade = Array.from({ length: visitsMadeCount }, (_, k) => ({
                    id: `visit-${reportIdCounter}-${k}`, name: `Personne Visitée ${k + 1}`, subject: ["Prière", "Encouragement", "Suivi"][Math.floor(Math.random() * 3)],
                    need: ["Soutien spirituel", "Aide matérielle", "Conseils"][Math.floor(Math.random() * 3)]
                }));
                const prayerRequests = [];
                if (Math.random() > 0.7) {
                    const prayerCount = Math.floor(Math.random() * 3) + 1;
                    for (let p = 0; p < prayerCount; p++) {
                        prayerRequests.push({
                            id: `prayer-${reportIdCounter}-${p}`,
                            subject: ["Prière pour la santé d'un membre", "Recherche d'emploi", "Sujet de prière pour la famille", "Protection divine"][Math.floor(Math.random() * 4)],
                            isAnonymous: Math.random() > 0.5,
                        });
                    }
                }
                const totalPresent = attendees + invitedPeopleCount;
                const report = {
                    cellDate: reportDate.toISOString().split('T')[0], region: cell.region, group: cell.group, district: cell.district,
                    cellName: cell.cellName, cellCategory: cell.cellCategory, leaderName: cell.leaderName, leaderContact: cell.leaderContact,
                    registeredMen, registeredWomen, registeredChildren, attendees, absentees, invitedPeople, totalPresent,
                    visitSchedule: "Visites prévues mardi et jeudi.", visitsMade, bibleStudy: Math.floor(Math.random() * totalPresent),
                    miracleHour: Math.floor(Math.random() * totalPresent), sundayServiceAttendance: Math.floor(Math.random() * totalPresent),
                    evangelismOuting: Math.random() > 0.7 ? "Sortie de groupe le Samedi" : "Aucune",
                    poignantTestimony: Math.random() > 0.8 ? testimonies[Math.floor(Math.random() * testimonies.length)] : "",
                    prayerRequests,
                    message: Math.random() > 0.9 ? "Le groupe a besoin de plus de bibles." : "",
                    submittedAt: new Date(reportDate.getTime() + Math.random() * 1000 * 3600 * 24).toISOString()
                };
                reports.push(report);
                reportIdCounter++;
            }
        });
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        events.push({
            title: 'Convention Nationale 2024',
            description: 'Rassemblement annuel de tous les fidèles du MVCP-BENIN pour un temps de prière, d\'enseignement et de communion.',
            date: nextMonth.toISOString(), location: 'Palais des Congrès, Cotonou', status: 'published',
            imageUrl: 'https://images.unsplash.com/photo-1579808463832-6a4a63f4a363?q=80&w=2070&auto=format&fit=crop'
        });
        events.push({
            title: 'Séminaire de Formation des Responsables',
            description: 'Session de formation intensive pour tous les responsables de cellules sur le thème "Le leadership serviteur".',
            date: nextWeek.toISOString(), location: 'Siège National, Cotonou', status: 'published',
            imageUrl: 'https://images.unsplash.com/photo-1529070412935-6f299845431d?q=80&w=2070&auto=format&fit=crop'
        });
        events.push({
            title: 'Préparation Journée d\'Évangélisation',
            description: 'Réunion de planification pour la grande journée d\'évangélisation nationale.',
            date: new Date().toISOString(), location: 'En ligne (Zoom)', status: 'draft'
        });
        communications.push({
            authorId: MOCK_ADMIN_USER.uid, authorName: MOCK_ADMIN_USER.name,
            title: "Message de Bienvenue sur la nouvelle plateforme",
            content: "Bienvenue à tous les pasteurs et responsables sur notre nouvel outil de reporting.",
            createdAt: new Date().toISOString(),
            target: { type: 'global' },
            status: 'publié'
        });
        const aPastor = users.find(u => u.role === types_1.UserRole.REGIONAL_PASTOR);
        if (aPastor) {
            communications.push({
                authorId: aPastor.uid, authorName: aPastor.name,
                title: "Proposition: Journée de prière pour la jeunesse",
                content: "Je propose d'organiser une journée spéciale de prière et de jeûne pour les jeunes de notre région.",
                createdAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                target: { type: 'region', region: aPastor.region },
                status: 'en_attente'
            });
        }
        return { users, groups, districts, cells, reports, events, communications };
    }
};
exports.SeederService = SeederService;
exports.SeederService = SeederService = SeederService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(report_schema_1.Report.name)),
    __param(2, (0, mongoose_1.InjectModel)(cell_schema_1.Cell.name)),
    __param(3, (0, mongoose_1.InjectModel)(group_schema_1.Group.name)),
    __param(4, (0, mongoose_1.InjectModel)(district_schema_1.District.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], SeederService);
//# sourceMappingURL=seeder.service.js.map