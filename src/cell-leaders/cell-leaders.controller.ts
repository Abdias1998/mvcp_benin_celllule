import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { CellLeadersService } from './cell-leaders.service';
import { CreateCellLeaderDto } from './dto/create-cell-leader.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/shared/types';

@Controller('cell-leaders')
export class CellLeadersController {
  constructor(private readonly cellLeadersService: CellLeadersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.GROUP_PASTOR, UserRole.DISTRICT_PASTOR)
  @Post()
  create(@Body() createCellLeaderDto: CreateCellLeaderDto, @Request() req) {
    return this.cellLeadersService.create(createCellLeaderDto, req.user);
  }
}
