import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GoogleAuthDto {
  @ApiProperty({ description: 'Google authorization code from frontend' })
  @IsString()
  @IsNotEmpty()
  code: string;
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