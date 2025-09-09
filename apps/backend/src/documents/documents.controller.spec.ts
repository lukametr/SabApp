jest.mock('../auth/guards/jwt-auth.guard', () => ({
  JwtAuthGuard: class {
    canActivate() {
      return true;
    }
  },
}));

jest.mock('../auth/guards/subscription.guard', () => ({
  SubscriptionGuard: class {
    canActivate() {
      return true;
    }
  },
}));
import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SubscriptionGuard } from '../auth/guards/subscription.guard';
import { ReportService } from './report.service';

describe('DocumentsController', () => {
  let controller: DocumentsController;
  const documentsService = {
    update: jest.fn(),
    create: jest.fn(),
  } as unknown as DocumentsService;
  const reportService = {} as ReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsController],
      providers: [
        { provide: DocumentsService, useValue: documentsService },
        { provide: ReportService, useValue: reportService },
        // Mock guards to bypass DI for their dependencies
        { provide: JwtAuthGuard, useValue: { canActivate: () => true } },
        { provide: SubscriptionGuard, useValue: { canActivate: () => true } },
      ],
    }).compile();

    controller = module.get<DocumentsController>(DocumentsController);
    (documentsService.update as any).mockReset();
    (documentsService.create as any).mockReset();
  });

  it('should parse hazards JSON, attach base64 photos and uploaded files, and call service.update', async () => {
    const id = 'doc123';
    const req = { user: { id: 'user1' } } as any;
    const base64Photo = 'data:image/png;base64,AAA';
    const payloadHazards = [
      {
        hazardIdentification: 'საფრთხე 1',
        affectedPersons: ['პირი 1'],
        injuryDescription: 'დაზიანება',
        existingControlMeasures: 'კონტროლი',
        initialRisk: { probability: 1, severity: 2, total: 3 },
        additionalControlMeasures: 'დამატებითი',
        residualRisk: { probability: 2, severity: 2, total: 4 },
        requiredMeasures: 'ზომები',
        responsiblePerson: 'პასუხისმგებელი',
        photos: [base64Photo],
      },
    ];
    const updateDto: any = { hazards: JSON.stringify(payloadHazards) };
    const files: any = {
      photos: undefined,
      hazardPhotos: [
        {
          mimetype: 'image/jpeg',
          buffer: Buffer.from('file-bytes'),
        },
      ],
    };

    (documentsService.update as any).mockResolvedValue({ id, hazards: [] });

    await controller.update(id, updateDto, files, req);

    expect(documentsService.update).toHaveBeenCalledTimes(1);
    const [calledId, updatePayload] = (documentsService.update as any).mock
      .calls[0];
    expect(calledId).toBe(id);
    expect(Array.isArray(updatePayload.hazards)).toBe(true);
    expect(updatePayload.hazards.length).toBe(1);
    const h = updatePayload.hazards[0];
    expect(h.hazardIdentification).toBe('საფრთხე 1');
    expect(Array.isArray(h.photos)).toBe(true);
    // must include original base64 + uploaded one
    expect(h.photos.length).toBe(2);
    expect(h.photos[0]).toBe(base64Photo);
    expect(h.photos[1]).toMatch(/^data:image\/jpeg;base64,/);
  });

  it('should not wipe hazards when hazards JSON is invalid', async () => {
    const id = 'doc124';
    const req = { user: { id: 'user1' } } as any;
    const updateDto: any = { hazards: '{invalid json' };
    const files: any = {};

    (documentsService.update as any).mockResolvedValue({ id, hazards: [] });

    await controller.update(id, updateDto, files, req);

    const [, updatePayload] = (documentsService.update as any).mock.calls[0];
    // hazards should be omitted to preserve existing hazards
    expect('hazards' in updatePayload).toBe(false);
  });

  it('should preserve hazards when hazards field is not provided on update', async () => {
    const id = 'doc125';
    const req = { user: { id: 'user1' } } as any;
    const updateDto: any = { objectName: 'Changed' }; // no hazards field
    const files: any = {};

    (documentsService.update as any).mockResolvedValue({
      id,
      hazards: [{ id: 'h1' }],
    });

    await controller.update(id, updateDto, files, req);
    const [, updatePayload] = (documentsService.update as any).mock.calls[0];
    expect('hazards' in updatePayload).toBe(false);
  });

  it('create() should accept base64 hazards photos, append uploaded hazard photo, and store document photos as base64', async () => {
    const req = { user: { id: 'user1' } } as any;
    const base64HazPhoto = 'data:image/png;base64,XYZ';
    const createDto: any = {
      evaluatorName: 'A',
      evaluatorLastName: 'B',
      objectName: 'Obj',
      workDescription: 'Work',
      date: new Date(),
      time: new Date(),
      hazards: JSON.stringify([
        {
          hazardIdentification: 'S1',
          affectedPersons: ['P1'],
          injuryDescription: 'I',
          existingControlMeasures: 'E',
          initialRisk: { probability: 1, severity: 1, total: 1 },
          additionalControlMeasures: 'A',
          residualRisk: { probability: 1, severity: 1, total: 1 },
          requiredMeasures: 'R',
          responsiblePerson: 'RP',
          photos: [base64HazPhoto],
        },
      ]),
    };
    const files: any = {
      photos: [{ mimetype: 'image/png', buffer: Buffer.from('doc-photo') }],
      hazardPhotos: [
        { mimetype: 'image/jpeg', buffer: Buffer.from('haz-photo') },
      ],
    };

    (documentsService.create as any).mockResolvedValue({ id: 'docNew' });

    await controller.create(createDto, files, req);

    expect(documentsService.create).toHaveBeenCalledTimes(1);
    const [payload] = (documentsService.create as any).mock.calls[0];
    expect(Array.isArray(payload.photos)).toBe(true);
    expect(payload.photos.length).toBe(1);
    expect(payload.photos[0]).toMatch(/^data:image\/png;base64,/);
    expect(Array.isArray(payload.hazards)).toBe(true);
    expect(payload.hazards.length).toBe(1);
    const hz = payload.hazards[0];
    expect(hz.photos.length).toBe(2);
    expect(hz.photos[0]).toBe(base64HazPhoto);
    expect(hz.photos[1]).toMatch(/^data:image\/jpeg;base64,/);
  });

  it('increments Excel download counter on excel download', async () => {
    const id = 'docX';
    (documentsService as any).findOne = jest
      .fn()
      .mockResolvedValue({ id, objectName: 'Obj' });
    (documentsService as any).incrementDownloadCounter = jest
      .fn()
      .mockResolvedValue(undefined);
    const res: any = {
      set: jest.fn(),
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const req: any = { user: { name: 'N' } };

    // stub report service via controller private field access not available; instead, spy on prototype method
    (controller as any).reportService = {
      generateExcelReport: jest.fn().mockResolvedValue(Buffer.from('excel')),
    };
    await controller.downloadExcelReport(id, res, req);
    expect(
      (documentsService as any).incrementDownloadCounter,
    ).toHaveBeenCalledWith(id, 'excel');
  });

  it('increments PDF download counter on pdf download', async () => {
    const id = 'docY';
    (documentsService as any).findOne = jest
      .fn()
      .mockResolvedValue({ id, objectName: 'Obj' });
    (documentsService as any).incrementDownloadCounter = jest
      .fn()
      .mockResolvedValue(undefined);
    const res: any = {
      set: jest.fn(),
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    (controller as any).reportService = {
      generatePDFReport: jest.fn().mockResolvedValue(Buffer.from('pdf')),
    };
    await controller.downloadPDFReport(id, res);
    expect(
      (documentsService as any).incrementDownloadCounter,
    ).toHaveBeenCalledWith(id, 'pdf');
  });
});
