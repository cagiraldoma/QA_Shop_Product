import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const reflector = app.get(Reflector);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: config.get<string>('cors.origin'),
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalGuards(new JwtAuthGuard(reflector), new RolesGuard(reflector));
  app.useGlobalInterceptors(new ResponseTransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('QA Shop API')
    .setDescription('E-commerce API for QA practice and automation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = config.get<number>('port') || 3000;
  await app.listen(port);
  console.log(`🚀 API running at http://localhost:${port}/api`);
  console.log(`📚 Swagger at  http://localhost:${port}/api/docs`);
}

bootstrap();
