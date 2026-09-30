import { IsString, IsOptional } from 'class-validator';

export class VerifyAccessDto {
  @IsOptional()
  @IsString()
  facialId?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  deviceId?: string;
}
