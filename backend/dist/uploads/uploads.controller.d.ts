import { StreamableFile } from '@nestjs/common';
import { Request, Response } from 'express';
import { MinioService } from './minio.service';
export declare class UploadsController {
    private readonly minioSvc;
    constructor(minioSvc: MinioService);
    serveLocalFile(req: Request, res: Response): StreamableFile;
}
