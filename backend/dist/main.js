"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const helmet_1 = require("helmet");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const transform_interceptor_1 = require("./common/interceptors/transform.interceptor");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['log', 'error', 'warn', 'debug'],
    });
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('PORT', 3001);
    const nodeEnv = configService.get('NODE_ENV', 'development');
    const corsOrigin = configService.get('CORS_ORIGIN', 'http://localhost:3000');
    app.use((0, helmet_1.default)());
    app.use(cookieParser());
    app.use(compression());
    app.enableCors({
        origin: corsOrigin,
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
        credentials: true,
    });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor(), new transform_interceptor_1.TransformInterceptor());
    if (configService.get('SWAGGER_ENABLED', 'true') === 'true') {
        const config = new swagger_1.DocumentBuilder()
            .setTitle(configService.get('SWAGGER_TITLE', 'G-GPFMS API'))
            .setDescription(configService.get('SWAGGER_DESCRIPTION', 'Gaderon Grants, Procurement & Financial Management ERP API'))
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
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('api/docs', app, document, {
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
//# sourceMappingURL=main.js.map