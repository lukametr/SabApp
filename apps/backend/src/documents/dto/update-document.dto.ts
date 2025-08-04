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

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    }
    return value;
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HazardDto)
  hazards?: HazardDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
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