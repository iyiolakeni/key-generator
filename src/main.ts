import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation pipe
  // This will automatically validate incoming requests based on DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true, // Strip properties that do not have decorators
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
    }),
  );

  app.enableCors({
    origin: '*', // Allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    allowedHeaders: 'Content-Type, Authorization', // Allowed headers
  });

  const config = new DocumentBuilder()
    .setTitle('Keys Generator API')
    .setDescription('API for generating and managing keys')
    .setVersion('1.0')
    .addTag('keys')
    .build();

  const documentFactory = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 7000);
}
bootstrap();
