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
  @Transform(({ value }) => {
    // Normalize to string[]
    if (value === null || value === undefined || value === '') return [];
    if (Array.isArray(value)) return value.filter((v) => typeof v === 'string');
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed.filter((v) => typeof v === 'string') : [];
      } catch {
        // If single string provided, wrap into array
        return [value];
      }
    }
    return [];
  })
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
  @Transform(({ value }) => {
    if (value === null || value === undefined || value === '') return [];
    if (Array.isArray(value)) return value.filter((v) => typeof v === 'string');
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed.filter((v) => typeof v === 'string') : [];
      } catch {
        // If it's a single base64 string, accept it as a one-element array
        return value.startsWith('data:image/') ? [value] : [];
      }
    }
    return [];
  })
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
    // Default to current date when missing/invalid to avoid validation failure
    if (value === null || value === undefined || value === '') return new Date();
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  })
  @IsDate()
  @Type(() => Date)
  date: Date;

  @Transform(({ value, obj }) => {
    console.log('⏰ TIME TRANSFORM:', { value, type: typeof value, obj_date: obj?.date });
    
    // თუ არ არის მნიშვნელობა, გამოიყენე მიმდინარე დრო
    if (!value && value !== 0 && value !== '0') {
      console.log('⏰ No time value, using current time');
      return new Date();
    }
    
    // თუ არის "HH:mm" ფორმატი
    if (typeof value === 'string') {
      const timeMatch = value.match(/^(\d{1,2}):(\d{2})$/);
      if (timeMatch) {
        const hours = parseInt(timeMatch[1], 10);
        const minutes = parseInt(timeMatch[2], 10);
        const baseDate = obj?.date ? new Date(obj.date) : new Date();
        baseDate.setHours(hours, minutes, 0, 0);
        console.log('⏰ Parsed time string:', baseDate);
        return baseDate;
      }
    }
    
    // სცადე Date პარსინგი
    const parsed = new Date(value);
    const result = isNaN(parsed.getTime()) ? new Date() : parsed;
    console.log('⏰ Parsed as Date:', result);
    return result;
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
  @Transform(({ value }) => {
    if (value === null || value === undefined || value === '') return [];
    if (Array.isArray(value)) return value.filter((v) => typeof v === 'string');
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed.filter((v) => typeof v === 'string') : [];
      } catch {
        // If it's a single base64 string, accept it as a one-element array
        return value.startsWith('data:image/') ? [value] : [];
      }
    }
    return [];
  })
  photos?: string[];
} 