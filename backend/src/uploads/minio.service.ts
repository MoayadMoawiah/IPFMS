import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name);
  private client: Minio.Client;
  private readonly bucket: string;
  private readonly localRoot: string;
  private useLocalStorage = false;

  constructor(private readonly config: ConfigService) {
    this.bucket = this.config.get<string>('MINIO_BUCKET', 'gpfms-documents');
    this.localRoot = path.resolve(
      this.config.get<string>('LOCAL_STORAGE_PATH', path.join(process.cwd(), 'storage')),
    );

    const forcedLocal = this.config.get<string>('STORAGE_DRIVER', '').toLowerCase() === 'local';
    if (forcedLocal) {
      this.useLocalStorage = true;
    }

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
    if (this.useLocalStorage) {
      this.ensureLocalRoot();
      this.logger.warn(`Using local filesystem storage at ${this.localRoot}`);
      return;
    }
    await this.ensureBucketExists(this.bucket);
  }

  isLocalStorage(): boolean {
    return this.useLocalStorage;
  }

  getLocalFilePath(storageKey: string): string {
    const normalized = storageKey.replace(/\\/g, '/').replace(/^\/+/, '');
    if (!normalized || normalized.includes('..')) {
      throw new Error('Invalid storage key');
    }
    const fullPath = path.resolve(this.localRoot, normalized);
    if (!fullPath.startsWith(this.localRoot)) {
      throw new Error('Invalid storage key');
    }
    return fullPath;
  }

  private ensureLocalRoot() {
    fs.mkdirSync(this.localRoot, { recursive: true });
  }

  private enableLocalFallback(reason: string) {
    if (this.useLocalStorage) return;
    this.useLocalStorage = true;
    this.ensureLocalRoot();
    this.logger.warn(`MinIO unavailable (${reason}); falling back to local storage at ${this.localRoot}`);
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
      this.enableLocalFallback(err.message || 'connection failed');
    }
  }

  private async writeLocalFile(buffer: Buffer, storageKey: string): Promise<string> {
    this.ensureLocalRoot();
    const fullPath = this.getLocalFilePath(storageKey);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    await fs.promises.writeFile(fullPath, buffer);
    return storageKey;
  }

  async uploadFile(
    buffer: Buffer,
    storageKey: string,
    mimeType: string,
    bucket?: string,
  ): Promise<string> {
    if (this.useLocalStorage) {
      return this.writeLocalFile(buffer, storageKey);
    }

    const targetBucket = bucket ?? this.bucket;
    try {
      await this.client.putObject(targetBucket, storageKey, buffer, buffer.length, {
        'Content-Type': mimeType,
      });
      return storageKey;
    } catch (err: any) {
      const code = err?.code ?? err?.name ?? '';
      const message = err?.message ?? String(err);
      if (code === 'ECONNREFUSED' || message.includes('ECONNREFUSED')) {
        this.enableLocalFallback('ECONNREFUSED');
        return this.writeLocalFile(buffer, storageKey);
      }
      throw err;
    }
  }

  async deleteFile(storageKey: string, bucket?: string): Promise<void> {
    if (this.useLocalStorage) {
      try {
        await fs.promises.unlink(this.getLocalFilePath(storageKey));
      } catch (err: any) {
        if (err?.code !== 'ENOENT') {
          this.logger.warn(`Failed to delete local object ${storageKey}: ${err.message}`);
        }
      }
      return;
    }

    const targetBucket = bucket ?? this.bucket;
    try {
      await this.client.removeObject(targetBucket, storageKey);
    } catch (err) {
      this.logger.warn(`Failed to delete object ${storageKey}: ${err.message}`);
    }
  }

  async getSignedUrl(storageKey: string, expirySeconds = 3600, bucket?: string): Promise<string> {
    if (this.useLocalStorage) {
      return this.buildPublicUrl(storageKey);
    }
    const targetBucket = bucket ?? this.bucket;
    return this.client.presignedGetObject(targetBucket, storageKey, expirySeconds);
  }

  buildPublicUrl(storageKey: string, bucket?: string): string {
    if (this.useLocalStorage) {
      const apiBase = this.config.get<string>('API_PUBLIC_URL', 'http://localhost:3001/api');
      return `${apiBase.replace(/\/$/, '')}/uploads/files/${storageKey
        .split('/')
        .map(encodeURIComponent)
        .join('/')}`;
    }

    const targetBucket = bucket ?? this.bucket;
    const endpoint = this.config.get<string>('MINIO_ENDPOINT', 'localhost');
    const port = this.config.get<number>('MINIO_PORT', 9000);
    const useSSL = this.config.get<string>('MINIO_USE_SSL', 'false') === 'true';
    const proto = useSSL ? 'https' : 'http';
    return `${proto}://${endpoint}:${port}/${targetBucket}/${storageKey}`;
  }
}
