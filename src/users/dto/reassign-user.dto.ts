import { IsString, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../../shared/types';

export class ReassignUserDto {
  @IsString()
  userId: string;

  @IsEnum(UserRole)
  @IsOptional()
  newRole?: UserRole;

  @IsString()
  @IsOptional()
  newRegion?: string;

  @IsString()
  @IsOptional()
  newGroup?: string;

  @IsString()
  @IsOptional()
  newDistrict?: string;
}
