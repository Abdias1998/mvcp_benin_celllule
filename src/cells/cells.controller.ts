import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CellsService } from './cells.service';
import { CreateCellDto } from './dto/create-cell.dto';
import { UpdateCellDto } from './dto/update-cell.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('cells')
export class CellsController {
  constructor(private readonly cellsService: CellsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createCellDto: CreateCellDto) {
    return this.cellsService.create(createCellDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAllForUser(@Request() req) {
    const user = req.user || null;
    return this.cellsService.findAllForUser(user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateCellDto: UpdateCellDto) {
    return this.cellsService.update(id, updateCellDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.cellsService.remove(id);
  }
}
