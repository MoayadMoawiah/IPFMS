import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class MinioService implements OnModuleInit {
    private readonly config;
    private readonly logger;
    private client;
    private readonly bucket;
    constructor(config: ConfigService);
    onModuleInit(): Promise<void>;
    private ensureBucketExists;
    uploadFile(buffer: Buffer, storageKey: string, mimeType: string, bucket?: string): Promise<string>;
    deleteFile(storageKey: string, bucket?: string): Promise<void>;
    getSignedUrl(storageKey: string, expirySeconds?: number, bucket?: string): Promise<string>;
    buildPublicUrl(storageKey: string, bucket?: string): string;
}
