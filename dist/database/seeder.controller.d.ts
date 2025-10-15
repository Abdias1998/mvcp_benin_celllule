import { SeederService } from './seeder.service';
import { ConfigService } from '@nestjs/config';
export declare class SeederController {
    private readonly seederService;
    private readonly configService;
    constructor(seederService: SeederService, configService: ConfigService);
    seedDatabase(key: string): Promise<{
        message: string;
    }>;
}
