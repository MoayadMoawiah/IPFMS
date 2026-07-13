import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor(private readonly config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get<string>('DATABASE_URL'),
        },
      },
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'error' },
        { emit: 'stdout', level: 'warn' },
      ],
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected');

    // Log slow queries in development
    if (process.env.NODE_ENV === 'development') {
      (this as any).$on('query', (e: any) => {
        if (e.duration > 100) {
          this.logger.warn(`Slow query (${e.duration}ms): ${e.query}`);
        }
      });
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Database disconnected');
  }

  /**
   * Soft delete helper — sets deletedAt to now()
   */
  async softDelete(model: string, id: string): Promise<void> {
    await (this as any)[model].update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  /**
   * Acquire PostgreSQL advisory lock for atomic serial number generation
   */
  async withAdvisoryLock<T>(lockKey: number, fn: () => Promise<T>): Promise<T> {
    await this.$executeRaw`SELECT pg_advisory_lock(${lockKey})`;
    try {
      return await fn();
    } finally {
      await this.$executeRaw`SELECT pg_advisory_unlock(${lockKey})`;
    }
  }
}
