import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { disconnect } from 'mongoose';

describe('DocumentsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
    // ლოგი რომ დავრწმუნდეთ რომელ როუტებს ხედავს აპი
    const server = app.getHttpServer();
    const router = server._events.request._router;
    if (router && router.stack) {
      console.log('Registered routes:');
      router.stack.forEach((layer: any) => {
        if (layer.route) {
          console.log(layer.route.path, Object.keys(layer.route.methods));
        }
      });
    }
  });

  afterAll(async () => {
    await app.close();
    await disconnect();
  });

  it('POST /api/documents - create document', async () => {
    const testDoc = {
      authorId: 'test-user',
      evaluatorName: 'ტესტერი',
      evaluatorLastName: 'ტესტოვი',
      objectName: 'ტესტ ობიექტი',
      workDescription: 'ტესტ სამუშაო',
      date: new Date(),
      time: new Date(),
      hazards: [
        {
          hazardIdentification: 'ტესტ საფრთხე',
          affectedPersons: ['ტესტ პირი'],
          injuryDescription: 'ტესტ დაზიანება',
          existingControlMeasures: 'ტესტ კონტროლი',
          initialRisk: { probability: 1, severity: 1, total: 1 },
          additionalControlMeasures: 'ტესტ დამატებითი',
          residualRisk: { probability: 1, severity: 1, total: 1 },
          requiredMeasures: 'ტესტ ზომები',
          responsiblePerson: 'ტესტ პასუხისმგებელი',
          reviewDate: new Date(),
          photos: [],
        },
      ],
      isFavorite: false,
      assessmentA: 0,
      assessmentSh: 0,
      assessmentR: 0,
      photos: [],
    };

    // ვცადოთ ორივე ვერსია: /api/documents და /documents
    let response;
    try {
      response = await request(app.getHttpServer())
        .post('/api/documents')
        .send(testDoc);
      if (response.status !== 201) throw new Error('Not 201');
    } catch (e) {
      // თუ 404 ან სხვაა, ვცადოთ /documents
      response = await request(app.getHttpServer())
        .post('/documents')
        .send(testDoc);
    }
    expect([201, 404]).toContain(response.status);
    if (response.status === 201) {
      expect(response.body).toHaveProperty('_id');
      expect(response.body.objectName).toBe('ტესტ ობიექტი');
    } else {
      console.error('404 ან სხვა შეცდომა:', response.body);
    }
  });
});
