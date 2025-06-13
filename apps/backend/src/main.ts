import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS კონფიგურაცია
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3002', 'http://localhost:3003'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // ვალიდაციის პაიპი
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // სტატიკური ფაილების სერვირება
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  // Swagger დოკუმენტაცია
  const config = new DocumentBuilder()
    .setTitle('Saba API')
    .setDescription('Saba აპლიკაციის API დოკუმენტაცია')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // პრეფიქსი
  app.setGlobalPrefix('api');

  await app.listen(8000);
}
bootstrap();
