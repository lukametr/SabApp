import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Display name of the user' })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Profile picture URL' })
  picture?: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Organization or company name' })
  organization?: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Job position or title' })
  position?: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Phone number in international or local format' })
  phoneNumber?: string | null;
}
