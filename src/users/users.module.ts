import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas/user.schema';
import { Cell, CellSchema } from '../cells/schemas/cell.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Cell.name, schema: CellSchema }
    ]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService], // Export service for AuthModule
})
export class UsersModule {}
