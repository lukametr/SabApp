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
    
    // თუ არის "HH:mm" ფორმატის სტრინგი
    if (typeof value === 'string' && value.includes(':')) {
      const [hours, minutes] = value.split(':').map(Number);
      if (!isNaN(hours) && !isNaN(minutes)) {
        const baseDate = obj?.date ? new Date(obj.date) : new Date();
        baseDate.setHours(hours, minutes, 0, 0);
        console.log('⏰ Created time from HH:mm format:', baseDate);
        return baseDate;
      }
    }
    
    // თუ არის რიცხვი (timestamp)
    if (typeof value === 'number') {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        console.log('⏰ Created time from timestamp:', date);
        return date;
      }
    }
    
    // თუ არის სტრინგი, სცადე Date პარსინგი
    if (typeof value === 'string') {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        console.log('⏰ Parsed time as Date string:', date);
        return date;
      }
    }
    
    // თუ უკვე არის Date ობიექტი
    if (value instanceof Date && !isNaN(value.getTime())) {
      console.log('⏰ Already a valid Date:', value);
      return value;
    }
    
    // Default: მიმდინარე დრო
    console.log('⏰ Using current time as default');
    return new Date();
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