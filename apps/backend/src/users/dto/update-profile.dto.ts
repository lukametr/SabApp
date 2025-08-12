import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({ description: 'Display name of the user' })
  name?: string;

  @ApiPropertyOptional({ description: 'Profile picture URL' })
  picture?: string | null;

  @ApiPropertyOptional({ description: 'Organization or company name' })
  organization?: string | null;

  @ApiPropertyOptional({ description: 'Job position or title' })
  position?: string | null;

  @ApiPropertyOptional({ description: 'Phone number in international or local format' })
  phoneNumber?: string | null;
}
