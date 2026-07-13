import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
export declare class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly config;
    private readonly logger;
    constructor(config: ConfigService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    softDelete(model: string, id: string): Promise<void>;
    withAdvisoryLock<T>(lockKey: number, fn: () => Promise<T>): Promise<T>;
}
