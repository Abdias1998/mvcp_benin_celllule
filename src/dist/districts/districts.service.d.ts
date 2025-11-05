import { Model } from 'mongoose';
import { District, DistrictDocument } from './schemas/district.schema';
import { CellDocument } from '../cells/schemas/cell.schema';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
export declare class DistrictsService {
    private districtModel;
    private cellModel;
    constructor(districtModel: Model<DistrictDocument>, cellModel: Model<CellDocument>);
    create(createDistrictDto: CreateDistrictDto): Promise<District>;
    findAll(): Promise<District[]>;
    update(id: string, updateDistrictDto: UpdateDistrictDto): Promise<District>;
    remove(id: string): Promise<any>;
}
