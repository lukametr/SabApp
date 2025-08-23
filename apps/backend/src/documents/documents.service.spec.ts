import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from './documents.service';
import { getModelToken } from '@nestjs/mongoose';
import { Document as DocEntity } from './schemas/document.schema';

describe('DocumentsService', () => {
  let service: DocumentsService;
  const model = {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
  } as any;

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        { provide: getModelToken(DocEntity.name), useValue: model },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
  });

  it('merges hazards when provided and keeps photos/date/time if omitted', async () => {
    const existing = {
      _id: 'doc1',
      authorId: 'user1',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
      date: new Date('2024-02-01'),
      time: new Date('2024-02-01T10:00:00Z'),
      photos: ['data:image/png;base64,AAA'],
      hazards: [
        { id: 'h1', hazardIdentification: 'Old', initialRisk: { probability: 1, severity: 1, total: 1 }, residualRisk: { probability: 1, severity: 1, total: 1 }, photos: ['X'] },
      ],
      toJSON() { return this; },
    } as any;

  model.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(existing) });
  model.findOneAndUpdate.mockReturnValue({ exec: jest.fn().mockResolvedValue({ ...existing, toJSON() { return this; } }) });

  await service.update('507f1f77bcf86cd799439011', {
      hazards: [
        { id: 'h1', hazardIdentification: 'New Title', initialRisk: { probability: 5 } } as any,
        { id: 'h2', hazardIdentification: 'Added', initialRisk: { probability: 1, severity: 1, total: 1 }, residualRisk: { probability: 1, severity: 1, total: 1 } } as any,
      ] as any,
    } as any, 'user1');

  expect(model.findOne).toHaveBeenCalled();
  expect(model.findOneAndUpdate).toHaveBeenCalled();
    const [, updateData] = model.findOneAndUpdate.mock.calls[0];
    expect(Array.isArray(updateData.hazards)).toBe(true);
    expect(updateData.hazards).toHaveLength(2);
    const h1 = updateData.hazards.find((h: any) => h.id === 'h1');
    expect(h1.hazardIdentification).toBe('New Title');
    // nested risk merged and defaulted
    expect(h1.initialRisk).toEqual({ probability: 5, severity: 1, total: 1 });
    expect(updateData.date).toEqual(existing.date);
    expect(updateData.time).toEqual(existing.time);
    expect(updateData.photos).toEqual(existing.photos);
  });

  it('keeps existing hazards when hazards not provided', async () => {
    const existing = {
      _id: 'doc1',
      authorId: 'user1',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
      hazards: [{ id: 'h1' }],
      toJSON() { return this; },
    } as any;
  model.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(existing) });
  model.findOneAndUpdate.mockReturnValue({ exec: jest.fn().mockResolvedValue({ ...existing, toJSON() { return this; } }) });

  await service.update('507f1f77bcf86cd799439011', { objectName: 'X' } as any, 'user1');
    const [, updateData] = model.findOneAndUpdate.mock.calls[0];
    expect(Array.isArray(updateData.hazards)).toBe(true);
    expect(updateData.hazards).toEqual(existing.hazards);
  });
});
