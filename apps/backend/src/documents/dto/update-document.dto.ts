import { IsOptional, IsString, IsDate, IsArray, ValidateNested } from 'class-validator';
import { Type, Transform } from 'class-transformer';

class RiskDto {
  @IsOptional()
  probability?: number;

  @IsOptional()
  severity?: number;

  @IsOptional()
  total?: number;
}

class HazardDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  hazardIdentification?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  affectedPersons?: string[];

  @IsOptional()
  @IsString()
  injuryDescription?: string;

  @IsOptional()
  @IsString()
  existingControlMeasures?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => RiskDto)
  initialRisk?: RiskDto;

  @IsOptional()
  @IsString()
  additionalControlMeasures?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => RiskDto)
  residualRisk?: RiskDto;

  @IsOptional()
  @IsString()
  requiredMeasures?: string;

  @IsOptional()
  @IsString()
  responsiblePerson?: string;

  @IsOptional()
  @Transform(({ value }) => (value === null || value === '' ? undefined : (typeof value === 'string' || typeof value === 'number') ? new Date(value) : value))
  @IsDate()
  @Type(() => Date)
  reviewDate?: Date;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photos?: string[];
}

export class UpdateDocumentDto {
  @IsOptional()
  @IsString()
  evaluatorName?: string;

  @IsOptional()
  @IsString()
  evaluatorLastName?: string;

  @IsOptional()
  @IsString()
  objectName?: string;

  @IsOptional()
  @IsString()
  workDescription?: string;

  @IsOptional()
  @Transform(({ value }) => value ? new Date(value) : undefined)
  @IsDate()
  @Type(() => Date)
  date?: Date;

  @IsOptional()
  @Transform(({ value }) => value ? new Date(value) : undefined)
  @IsDate()
  @Type(() => Date)
  time?: Date;

  // Hazards must be provided as an array; do not parse JSON strings here
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HazardDto)
  hazards?: HazardDto[];

  // Photos should be base64 data URLs or http(s) URLs
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.filter(photo =>
        typeof photo === 'string' &&
        (photo.startsWith('data:image/') || photo.startsWith('http'))
      );
    }
    return value;
  })
  photos?: string[];

  // Metadata fields for preserving document integrity
  @IsOptional()
  @IsString()
  authorId?: string;

  @IsOptional()
  @Transform(({ value }) => value ? new Date(value) : undefined)
  @IsDate()
  @Type(() => Date)
  createdAt?: Date;

  @IsOptional()
  @Transform(({ value }) => value ? new Date(value) : undefined)
  @IsDate()
  @Type(() => Date)
  updatedAt?: Date;

  @IsOptional()
  isFavorite?: boolean;

  @IsOptional()
  assessmentA?: number;

  @IsOptional()
  assessmentSh?: number;

  @IsOptional()
  assessmentR?: number;
} 