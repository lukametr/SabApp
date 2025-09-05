import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ description: 'მიმდინარე პაროლი' })
  @IsString()
  currentPassword: string;

  @ApiProperty({ description: 'ახალი პაროლი (მინიმუმ 6 სიმბოლო)' })
  @IsString()
  @MinLength(6, { message: 'პაროლი უნდა შეიცავდეს მინიმუმ 6 სიმბოლოს' })
  newPassword: string;
}
