import { IsOptional, IsString, IsDate } from 'class-validator';

export class UpdateDocumentDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  filePath?: string;

  @IsOptional()
  @IsDate()
  uploadDate?: Date;
} 