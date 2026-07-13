"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MinioService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinioService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const Minio = require("minio");
let MinioService = MinioService_1 = class MinioService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(MinioService_1.name);
        this.bucket = this.config.get('MINIO_BUCKET', 'gpfms-documents');
        this.client = new Minio.Client({
            endPoint: this.config.get('MINIO_ENDPOINT', 'localhost'),
            port: parseInt(this.config.get('MINIO_PORT', '9000'), 10),
            useSSL: this.config.get('MINIO_USE_SSL', 'false') === 'true',
            accessKey: this.config.get('MINIO_ACCESS_KEY', 'minioadmin'),
            secretKey: this.config.get('MINIO_SECRET_KEY', 'minioadmin'),
            region: this.config.get('MINIO_REGION', 'us-east-1'),
        });
    }
    async onModuleInit() {
        await this.ensureBucketExists(this.bucket);
    }
    async ensureBucketExists(bucket) {
        try {
            const exists = await this.client.bucketExists(bucket);
            if (!exists) {
                await this.client.makeBucket(bucket, this.config.get('MINIO_REGION', 'us-east-1'));
                this.logger.log(`Created MinIO bucket: ${bucket}`);
            }
        }
        catch (err) {
            this.logger.warn(`MinIO bucket check failed (${bucket}): ${err.message}`);
        }
    }
    async uploadFile(buffer, storageKey, mimeType, bucket) {
        const targetBucket = bucket ?? this.bucket;
        await this.client.putObject(targetBucket, storageKey, buffer, buffer.length, {
            'Content-Type': mimeType,
        });
        return storageKey;
    }
    async deleteFile(storageKey, bucket) {
        const targetBucket = bucket ?? this.bucket;
        try {
            await this.client.removeObject(targetBucket, storageKey);
        }
        catch (err) {
            this.logger.warn(`Failed to delete object ${storageKey}: ${err.message}`);
        }
    }
    async getSignedUrl(storageKey, expirySeconds = 3600, bucket) {
        const targetBucket = bucket ?? this.bucket;
        return this.client.presignedGetObject(targetBucket, storageKey, expirySeconds);
    }
    buildPublicUrl(storageKey, bucket) {
        const targetBucket = bucket ?? this.bucket;
        const endpoint = this.config.get('MINIO_ENDPOINT', 'localhost');
        const port = this.config.get('MINIO_PORT', 9000);
        const useSSL = this.config.get('MINIO_USE_SSL', 'false') === 'true';
        const proto = useSSL ? 'https' : 'http';
        return `${proto}://${endpoint}:${port}/${targetBucket}/${storageKey}`;
    }
};
exports.MinioService = MinioService;
exports.MinioService = MinioService = MinioService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MinioService);
//# sourceMappingURL=minio.service.js.map