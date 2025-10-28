import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CellLeadersController } from './cell-leaders.controller';
import { CellLeadersService } from './cell-leaders.service';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [CellLeadersController],
  providers: [CellLeadersService],
})
export class CellLeadersModule {}
