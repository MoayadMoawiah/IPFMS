import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug'],
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3001);
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');
  const corsOrigin = configService.get<string>('CORS_ORIGIN', 'http://localhost:3000');

  // Security
  app.use(helmet());
  app.use(cookieParser());
  app.use(compression());

  // CORS
  app.enableCors({
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );

  // Swagger (dev/staging only)
  if (configService.get('SWAGGER_ENABLED', 'true') === 'true') {
    const config = new DocumentBuilder()
      .setTitle(configService.get('SWAGGER_TITLE', 'G-GPFMS API'))
      .setDescription(
        configService.get(
          'SWAGGER_DESCRIPTION',
          'Gaderon Grants, Procurement & Financial Management ERP API',
        ),
      )
      .setVersion(configService.get('SWAGGER_VERSION', '1.0.0'))
      .addBearerAuth()
      .addTag('Auth', 'Authentication & Authorization')
      .addTag('Users', 'User Management')
      .addTag('Roles', 'Role & Permission Management')
      .addTag('Grants', 'Grant Management')
      .addTag('Donors', 'Donor Management')
      .addTag('Projects', 'Project & Activity Management')
      .addTag('Annual Plans', 'Annual Procurement Plans')
      .addTag('Requisitions', 'Purchase Requisitions')
      .addTag('Vendors', 'Vendor Management')
      .addTag('RFQ', 'Request for Quotation')
      .addTag('Purchase Orders', 'Purchase Order Management')
      .addTag('Goods Receipts', 'Goods Receipt Notes')
      .addTag('Contracts', 'Contract Management')
      .addTag('Finance', 'Finance & Accounting')
      .addTag('Journal Entries', 'Journal Entry Management')
      .addTag('Payments', 'Payment Management')
      .addTag('Inventory', 'Inventory Management')
      .addTag('Assets', 'Fixed Asset Management')
      .addTag('Workflow', 'Workflow Engine')
      .addTag('Serial', 'Serial Number Engine')
      .addTag('Reports', 'Reports & Analytics')
      .addTag('Notifications', 'Notification Management')
      .addTag('Audit', 'Audit Log')
      .addTag('Dashboard', 'Dashboard KPIs')
      .addTag('Search', 'Global Search')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
      },
    });
  }

  await app.listen(port);

  console.log(`\n🚀 G-GPFMS API running on: http://localhost:${port}/api`);
  if (nodeEnv !== 'production') {
    console.log(`📖 Swagger docs:         http://localhost:${port}/api/docs`);
  }
}

bootstrap();
