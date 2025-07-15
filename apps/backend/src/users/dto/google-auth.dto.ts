import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GoogleAuthDto {
  @ApiProperty({ description: 'Google ID token from frontend' })
  @IsString()
  @IsNotEmpty()
  idToken: string;

  @ApiProperty({ description: 'Personal number (required for registration)', required: false })

  @ApiProperty({ description: 'Phone number (required for registration)', required: false })
}

export class CompleteRegistrationDto {
  @ApiProperty({ description: 'Google ID token from frontend' })
  @IsString()
  @IsNotEmpty()
  idToken: string;

  @ApiProperty({ description: 'Personal number (required for registration)' })

  @ApiProperty({ description: 'Phone number (required for registration)' })
}

export class GoogleUserInfo {
  @ApiProperty()
  sub: string; // Google ID

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  picture?: string;

  @ApiProperty()
  email_verified: boolean;
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
    // Removed personalNumber and phoneNumber
  };
} 