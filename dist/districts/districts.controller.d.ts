import { DistrictsService } from './districts.service';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
export declare class DistrictsController {
    private readonly districtsService;
    constructor(districtsService: DistrictsService);
    create(createDistrictDto: CreateDistrictDto): Promise<import("./schemas/district.schema").District>;
    findAll(): Promise<import("./schemas/district.schema").District[]>;
    update(id: string, updateDistrictDto: UpdateDistrictDto): Promise<import("./schemas/district.schema").District>;
    remove(id: string): Promise<any>;
}
