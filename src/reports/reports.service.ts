import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report, ReportDocument } from './schemas/report.schema';
import { CreateReportDto } from './dto/create-report.dto';
import { User, UserRole } from 'src/shared/types';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name) private reportModel: Model<ReportDocument>,
  ) {}

  async create(createReportDto: CreateReportDto): Promise<Report> {
    const newReport = new this.reportModel({
      ...createReportDto,
      submittedAt: new Date().toISOString(),
    });
    return newReport.save();
  }

  async findAll(user: User, dateRange: { start: string; end: string }): Promise<Report[]> {
    const query: any = {
      cellDate: {
        $gte: dateRange.start,
        $lte: dateRange.end,
      },
    };

    // 🔍 Log de l'utilisateur qui fait la requête
    console.log('🔍 [REPORTS SERVICE] Utilisateur:', {
      role: user.role,
      name: user.name,
      region: user.region,
      group: user.group,
      district: user.district,
    });

    switch (user.role) {
      case UserRole.REGIONAL_PASTOR:
        query.region = user.region;
        break;
      case UserRole.GROUP_PASTOR:
        query.region = user.region;
        query.group = user.group;
        break;
      case UserRole.DISTRICT_PASTOR:
        query.region = user.region;
        query.group = user.group;
        query.district = user.district;
        break;
      case UserRole.CELL_LEADER:
        // Le responsable de cellule ne voit que les rapports de sa propre cellule
        query.region = user.region;
        query.group = user.group;
        query.district = user.district;
        query.cellName = user.cellName;
        query.cellCategory = user.cellCategory;
        break;
      case UserRole.NATIONAL_COORDINATOR:
      default:
        // No additional filters
        break;
    }

    // 🔍 Log de la requête MongoDB
    console.log('🔍 [REPORTS SERVICE] Query MongoDB:', JSON.stringify(query, null, 2));

    const results = await this.reportModel
      .find(query)
      .sort({ submittedAt: -1 })
      .exec();

    // 🔍 Log des résultats
    console.log('🔍 [REPORTS SERVICE] Nombre de rapports trouvés:', results.length);
    if (results.length > 0) {
      console.log('🔍 [REPORTS SERVICE] Premier rapport:', {
        region: results[0].region,
        group: results[0].group,
        district: results[0].district,
        cellName: results[0].cellName,
      });
    }

    return results;
  }

  async remove(id: string): Promise<any> {
    return this.reportModel.findByIdAndDelete(id).exec();
  }
}
