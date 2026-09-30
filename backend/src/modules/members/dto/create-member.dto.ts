import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';

export class CreateMemberDto {
  @IsString()
  @MinLength(3)
  name!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  cpf?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  facialId?: string;

  @IsOptional()
  @IsString()
  facialPhotoUrl?: string;

  @IsOptional()
  @IsString()
  planId?: string;
}
