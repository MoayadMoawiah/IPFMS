import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bull';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RbacModule } from './rbac/rbac.module';
import { SerialModule } from './serial/serial.module';
import { AuditModule } from './audit/audit.module';
import { WorkflowModule } from './workflow/workflow.module';
import { NotificationsModule } from './notifications/notifications.module';
import { GrantsModule } from './grants/grants.module';
import { ProjectsModule } from './projects/projects.module';
import { ProcurementModule } from './procurement/procurement.module';
import { FinanceModule } from './finance/finance.module';
import { InventoryModule } from './inventory/inventory.module';
import { AssetsModule } from './assets/assets.module';
import { ReportsModule } from './reports/reports.module';
import { PdfModule } from './pdf/pdf.module';
import { SearchModule } from './search/search.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),

    // Rate limiting
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get<number>('RATE_LIMIT_TTL', 60) * 1000,
          limit: config.get<number>('RATE_LIMIT_MAX', 100),
        },
      ],
    }),

    // Job Queue
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: config.get<string>('REDIS_URL', 'redis://localhost:6379'),
      }),
    }),

    // Core modules
    PrismaModule,
    AuditModule,
    SerialModule,
    WorkflowModule,
    NotificationsModule,
    PdfModule,
    UploadsModule,

    // Domain modules
    AuthModule,
    UsersModule,
    RbacModule,
    GrantsModule,
    ProjectsModule,
    ProcurementModule,
    FinanceModule,
    InventoryModule,
    AssetsModule,
    ReportsModule,
    SearchModule,
  ],
})
export class AppModule {}
