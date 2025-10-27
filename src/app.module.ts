import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { CellsModule } from './cells/cells.module';
import { GroupsModule } from './groups/groups.module';
import { DistrictsModule } from './districts/districts.module';
import { DatabaseModule } from './database/database.module';
import { CellLeadersModule } from './cell-leaders/cell-leaders.module';
import { TestController } from './test/test.controller'; 

@Module({
  imports: [
    // --- Configuration d'abord ---
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // --- Serve Frontend Build ---
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),  
    }),
  
    // --- Database ---
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({ 
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService], 
    }),

    // --- Feature Modules ---
    AuthModule,
    UsersModule,
    ReportsModule,
    CellsModule,
    GroupsModule,
    DistrictsModule,
    DatabaseModule,
    CellLeadersModule,
  ],
  controllers: [TestController],
  providers: [],
})
export class AppModule {}
