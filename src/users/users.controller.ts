import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/shared/types';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Endpoint accessible à tous les utilisateurs authentifiés (pas de restriction de rôle)
  @UseGuards(JwtAuthGuard)
  @Get('hierarchy')
  getHierarchy(@Request() req) {
    return this.usersService.getUsersByHierarchy(req.user);
  }

  // Les endpoints suivants sont réservés au coordinateur national
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.NATIONAL_COORDINATOR)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.NATIONAL_COORDINATOR)
  @Get('pending')
  findPending() {
    return this.usersService.getPendingPastors();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.NATIONAL_COORDINATOR)
  @Get()
  findAll() {
    return this.usersService.getPastors();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.NATIONAL_COORDINATOR)
  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.usersService.approvePastor(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.NATIONAL_COORDINATOR)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.NATIONAL_COORDINATOR)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
