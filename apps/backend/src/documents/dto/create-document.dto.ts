import { IsString, IsOptional } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: string;
} 