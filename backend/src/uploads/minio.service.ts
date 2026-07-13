import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name);
  private client: Minio.Client;
  private readonly bucket: string;

  constructor(private readonly config: ConfigService) {
    this.bucket = this.config.get<string>('MINIO_BUCKET', 'gpfms-documents');

    this.client = new Minio.Client({
      endPoint: this.config.get<string>('MINIO_ENDPOINT', 'localhost'),
      port: parseInt(this.config.get('MINIO_PORT', '9000'), 10),
      useSSL: this.config.get<string>('MINIO_USE_SSL', 'false') === 'true',
      accessKey: this.config.get<string>('MINIO_ACCESS_KEY', 'minioadmin'),
      secretKey: this.config.get<string>('MINIO_SECRET_KEY', 'minioadmin'),
      region: this.config.get<string>('MINIO_REGION', 'us-east-1'),
    });
  }

  async onModuleInit() {
    await this.ensureBucketExists(this.bucket);
  }

  private async ensureBucketExists(bucket: string) {
    try {
      const exists = await this.client.bucketExists(bucket);
      if (!exists) {
        await this.client.makeBucket(bucket, this.config.get<string>('MINIO_REGION', 'us-east-1'));
        this.logger.log(`Created MinIO bucket: ${bucket}`);
      }
    } catch (err) {
      this.logger.warn(`MinIO bucket check failed (${bucket}): ${err.message}`);
    }
  }

  async uploadFile(
    buffer: Buffer,
    storageKey: string,
    mimeType: string,
    bucket?: string,
  ): Promise<string> {
    const targetBucket = bucket ?? this.bucket;
    await this.client.putObject(targetBucket, storageKey, buffer, buffer.length, {
      'Content-Type': mimeType,
    });
    return storageKey;
  }

  async deleteFile(storageKey: string, bucket?: string): Promise<void> {
    const targetBucket = bucket ?? this.bucket;
    try {
      await this.client.removeObject(targetBucket, storageKey);
    } catch (err) {
      this.logger.warn(`Failed to delete object ${storageKey}: ${err.message}`);
    }
  }

  async getSignedUrl(storageKey: string, expirySeconds = 3600, bucket?: string): Promise<string> {
    const targetBucket = bucket ?? this.bucket;
    return this.client.presignedGetObject(targetBucket, storageKey, expirySeconds);
  }

  buildPublicUrl(storageKey: string, bucket?: string): string {
    const targetBucket = bucket ?? this.bucket;
    const endpoint = this.config.get<string>('MINIO_ENDPOINT', 'localhost');
    const port = this.config.get<number>('MINIO_PORT', 9000);
    const useSSL = this.config.get<string>('MINIO_USE_SSL', 'false') === 'true';
    const proto = useSSL ? 'https' : 'http';
    return `${proto}://${endpoint}:${port}/${targetBucket}/${storageKey}`;
  }
}
