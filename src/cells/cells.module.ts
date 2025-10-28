import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CellsService } from './cells.service';
import { CellsController } from './cells.controller';
import { Cell, CellSchema } from './schemas/cell.schema';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cell.name, schema: CellSchema },
      { name: User.name, schema: UserSchema }
    ]),
  ],
  controllers: [CellsController],
  providers: [CellsService],
})
export class CellsModule {}
