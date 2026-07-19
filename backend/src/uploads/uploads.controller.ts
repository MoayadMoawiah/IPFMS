import {
  Controller,
  Get,
  NotFoundException,
  Req,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { createReadStream, existsSync } from 'fs';
import * as path from 'path';
import { Request, Response } from 'express';
import { MinioService } from './minio.service';

const MIME_BY_EXT: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
};

@ApiExcludeController()
@Controller('uploads')
export class UploadsController {
  constructor(private readonly minioSvc: MinioService) {}

  /**
   * NestJS 10 / Express 4: use `files/*` (not Nest 11 `files/*path`).
   * Path after /files/ is taken from the URL so nested keys work reliably.
   */
  @Get('files/*')
  serveLocalFile(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): StreamableFile {
    if (!this.minioSvc.isLocalStorage()) {
      throw new NotFoundException('Local file serving is not enabled');
    }

    const marker = '/uploads/files/';
    const fullUrl = req.originalUrl || req.url || '';
    const idx = fullUrl.indexOf(marker);
    const raw =
      idx >= 0
        ? fullUrl.slice(idx + marker.length).split('?')[0]
        : String((req.params as Record<string, string>)['0'] ?? '');
    const storageKey = raw
      .split('/')
      .filter(Boolean)
      .map((segment) => decodeURIComponent(segment))
      .join('/');

    if (!storageKey) {
      throw new NotFoundException('File not found');
    }

    let fullPath: string;
    try {
      fullPath = this.minioSvc.getLocalFilePath(storageKey);
    } catch {
      throw new NotFoundException('File not found');
    }

    if (!existsSync(fullPath)) {
      throw new NotFoundException('File not found');
    }

    const ext = path.extname(fullPath).toLowerCase();
    const mimeType = MIME_BY_EXT[ext] || 'application/octet-stream';
    const fileName = storageKey.split('/').pop() || 'file';
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
    return new StreamableFile(createReadStream(fullPath));
  }
}
