import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GoogleAuthDto {
  @ApiProperty({ description: 'Google authorization code from frontend', required: false })
  @IsString()
  code?: string;

  @ApiProperty({ description: 'Google access token from frontend', required: false })
  @IsString()
  accessToken?: string;

  @ApiProperty({ description: 'Full name from frontend', required: false })
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Organization from frontend', required: false })
  @IsString()
  organization?: string;

  @ApiProperty({ description: 'Position from frontend', required: false })
  @IsString()
  position?: string;
}

export class CompleteRegistrationDto {
  @ApiProperty({ description: 'Google authorization code from frontend' })
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class GoogleUserInfo {
  @ApiProperty()
  sub: string; // Google ID

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  picture?: string;

  @ApiProperty()
  email_verified: boolean;

  @ApiProperty({ required: false })
  organization?: string;
  @ApiProperty({ required: false })
  position?: string;
}

export class AuthResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  user: {
    id: string;
    name: string;
    email: string;
    picture?: string;
    role: string;
    status: string;
    googleId?: string;
    authProvider?: string;
    isEmailVerified?: boolean;
    // Removed personalNumber and phoneNumber
  };
}