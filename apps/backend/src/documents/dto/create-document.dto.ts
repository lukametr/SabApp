import { IsString, IsOptional, IsDate, IsArray, IsNumber, ValidateNested, IsObject } from 'class-validator';
import { Type, Transform } from 'class-transformer';

class RiskDto {
  @Transform(({ value }) => (value === '' || value === null || value === undefined ? undefined : Number(value)))
  @IsOptional()
  @IsNumber()
  probability?: number;

  @Transform(({ value }) => (value === '' || value === null || value === undefined ? undefined : Number(value)))
  @IsOptional()
  @IsNumber()
  severity?: number;

  @Transform(({ value }) => (value === '' || value === null || value === undefined ? undefined : Number(value)))
  @IsOptional()
  @IsNumber()
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
  @IsObject()
  @ValidateNested()
  @Type(() => RiskDto)
  initialRisk?: RiskDto;

  @IsOptional()
  @IsString()
  additionalControlMeasures?: string;

  @IsOptional()
  @IsObject()
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
  @Transform(({ value }) => {
    // Treat null/empty as undefined so IsOptional skips validation
    if (value === null || value === '' || value === undefined) return undefined;
    const d = new Date(value);
    return isNaN(d.getTime()) ? undefined : d;
  })
  @IsDate()
  @Type(() => Date)
  reviewDate?: Date;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photos?: string[];
}

export class CreateDocumentDto {
  @IsString()
  evaluatorName: string;

  @IsString()
  evaluatorLastName: string;

  @IsString()
  objectName: string;

  @IsString()
  workDescription: string;

  @Transform(({ value }) => {
    if (!value && value !== 0) return undefined;
    const d = new Date(value);
    return isNaN(d.getTime()) ? undefined : d;
  })
  @IsDate()
  @Type(() => Date)
  date: Date;

  @Transform(({ value, obj }) => {
    if (!value && value !== 0) return undefined;
    // Accept ISO datetime, timestamp, or HH:mm strings
    if (typeof value === 'string') {
      const timeMatch = value.match(/^\s*(\d{1,2}):(\d{2})\s*$/);
      if (timeMatch) {
        const hours = parseInt(timeMatch[1], 10);
        const minutes = parseInt(timeMatch[2], 10);
        const baseDate = obj?.date ? new Date(obj.date) : new Date();
        if (!isNaN(baseDate.getTime())) {
          baseDate.setHours(hours, minutes, 0, 0);
          return baseDate;
        }
      }
    }
    const d = new Date(value);
    return isNaN(d.getTime()) ? undefined : d;
  })
  @IsDate()
  @Type(() => Date)
  time: Date;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === null || value === undefined || value === '') return [];
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return Array.isArray(value) ? value : [];
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HazardDto)
  hazards?: HazardDto[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  photos?: string[];
} 