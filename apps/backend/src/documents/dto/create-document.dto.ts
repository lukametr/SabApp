import { IsString, IsOptional, IsDate, IsArray, IsNumber, ValidateNested, IsObject } from 'class-validator';
import { Type, Transform } from 'class-transformer';

class RiskDto {
  @IsNumber()
  probability: number;

  @IsNumber()
  severity: number;

  @IsNumber()
  total: number;
}

class HazardDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  hazardIdentification: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  affectedPersons?: string[];

  @IsString()
  injuryDescription: string;

  @IsString()
  existingControlMeasures: string;

  @IsObject()
  @ValidateNested()
  @Type(() => RiskDto)
  initialRisk: RiskDto;

  @IsString()
  additionalControlMeasures: string;

  @IsObject()
  @ValidateNested()
  @Type(() => RiskDto)
  residualRisk: RiskDto;

  @IsString()
  requiredMeasures: string;

  @IsString()
  responsiblePerson: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  reviewDate?: Date;

  @IsArray()
  @IsString({ each: true })
  photos: string[];
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

  @Transform(({ value }) => value ? new Date(value) : undefined)
  @IsDate()
  @Type(() => Date)
  date: Date;

  @Transform(({ value }) => value ? new Date(value) : undefined)
  @IsDate()
  @Type(() => Date)
  time: Date;

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
  hazards?: HazardDto[] | string; // Can be array or JSON string

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  photos?: string[];
} 