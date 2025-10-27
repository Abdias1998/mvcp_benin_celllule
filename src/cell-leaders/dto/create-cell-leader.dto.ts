import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCellLeaderDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  contact: string;

  @IsString()
  @IsNotEmpty()
  region: string;

  @IsString()
  @IsNotEmpty()
  group: string;

  @IsString()
  @IsNotEmpty()
  district: string;

  @IsString()
  @IsNotEmpty()
  cellName: string;

  @IsString()
  @IsNotEmpty()
  cellCategory: string;
}
