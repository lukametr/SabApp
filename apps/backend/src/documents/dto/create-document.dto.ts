import { IsString, IsOptional, IsDate, IsArray, IsNumber, ValidateNested, IsObject } from 'class-validator';
import { Type, Transform } from 'class-transformer';

// Transform helpers
const transformToStringArray = ({ value }: { value: any }) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter((v) => typeof v === 'string');
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.filter((v) => typeof v === 'string') : [value];
    } catch {
      return value.startsWith('data:image/') ? [value] : [value];
    }
  }
  return [];
};

const transformToNumber = ({ value }: { value: any }) => {
  if (value === '' || value == null) return undefined;
  return Number(value);
};

class RiskDto {
  @Transform(transformToNumber)
  @IsOptional()
  @IsNumber()
  probability?: number;

  @Transform(transformToNumber)
  @IsOptional()
  @IsNumber()
  severity?: number;

  @Transform(transformToNumber)
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
  @Transform(transformToStringArray)
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
  @Transform(({ value }) => {
    if (value === null || value === undefined || value === '') return undefined;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return typeof parsed === 'object' && parsed !== null ? parsed : undefined;
      } catch {
        return undefined;
      }
    }
    return value;
  })
  initialRisk?: RiskDto;

  @IsOptional()
  @IsString()
  additionalControlMeasures?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => RiskDto)
  @Transform(({ value }) => {
    if (value === null || value === undefined || value === '') return undefined;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return typeof parsed === 'object' && parsed !== null ? parsed : undefined;
      } catch {
        return undefined;
      }
    }
    return value;
  })
  residualRisk?: RiskDto;

  @IsOptional()
  @IsString()
  requiredMeasures?: string;

  @IsOptional()
  @IsString()
  responsiblePerson?: string;

  @IsOptional()
  @IsString()
  implementationDeadlines?: string;

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
  @Transform(transformToStringArray)
  photos?: string[];
}

export class CreateDocumentDto {
  @Transform(({ value }) => {
  if (typeof value === 'string') return value;
  return String(value || '');
  })
  @IsString()
  evaluatorName: string;

  @Transform(({ value }) => {
  if (typeof value === 'string') return value;
  return String(value || '');
  })
  @IsString()
  evaluatorLastName: string;

  @Transform(({ value }) => {
  if (typeof value === 'string') return value;
  return String(value || '');
  })
  @IsString()
  objectName: string;

  @Transform(({ value }) => {
    if (typeof value === 'string') return value;
    return String(value || '');
  })
  @IsString()
  workDescription: string;

  @Transform(({ value }) => {
    if (!value) return new Date();
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  })
  @IsDate()
  @Type(() => Date)
  date: Date;

  @Transform(({ value, obj }) => {
    if (!value) return new Date();

    // Handle "HH:mm" format
    if (typeof value === 'string' && /^\d{1,2}:\d{2}$/.test(value)) {
      const [hours, minutes] = value.split(':').map(Number);
      const baseDate = obj?.date ? new Date(obj.date) : new Date();
      baseDate.setHours(hours, minutes, 0, 0);
      return baseDate;
    }

    // Try to parse as date
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  })
  @IsDate()
  @Type(() => Date)
  time: Date;

  @Transform(({ value }) => {
    if (!value) return undefined;
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? undefined : parsed;
  })
  @IsDate()
  @Type(() => Date)
  reviewDate: Date;

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
  @Transform(transformToStringArray)
  photos?: string[];
} 