import { Injectable, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProcurementDocType } from '@prisma/client';

@Injectable()
export class SerialService {
  private readonly logger = new Logger(SerialService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generate the next serial number for a grant+docType combination.
   * Uses PostgreSQL advisory locks to ensure uniqueness under concurrency.
   *
   * Example: next('USAID-2026', 'PR') → 'USAID-2026-PR-0001'
   *
   * @param grantCode - Grant code (e.g. 'USAID-2026')
   * @param docType   - Document type enum (e.g. 'PR', 'PO', 'GRN')
   * @param padding   - Zero-padding width (default: 4)
   */
  async next(
    grantCode: string,
    docType: ProcurementDocType | string,
    padding = 4,
  ): Promise<string> {
    // Create a deterministic lock key from grantCode + docType
    const lockKey = this.computeLockKey(grantCode, docType as string);

    return this.prisma.withAdvisoryLock(lockKey, async () => {
      // Find or create the sequence
      const sequence = await this.prisma.serialSequence.upsert({
        where: {
          grantCode_docType: {
            grantCode,
            docType: docType as ProcurementDocType,
          },
        },
        update: { lastNumber: { increment: 1 } },
        create: {
          grantCode,
          docType: docType as ProcurementDocType,
          lastNumber: 1,
        },
      });

      // Format: GRANT-CODE-DOCTYPE-NNNN
      const paddedNumber = sequence.lastNumber.toString().padStart(padding, '0');
      return `${grantCode}-${docType}-${paddedNumber}`;
    });
  }

  /**
   * Preview the next serial number WITHOUT incrementing.
   * Used for display in create forms.
   */
  async preview(grantCode: string, docType: string, padding = 4): Promise<string> {
    const sequence = await this.prisma.serialSequence.findUnique({
      where: {
        grantCode_docType: {
          grantCode,
          docType: docType as ProcurementDocType,
        },
      },
    });

    const nextNumber = (sequence?.lastNumber ?? 0) + 1;
    const paddedNumber = nextNumber.toString().padStart(padding, '0');
    return `${grantCode}-${docType}-${paddedNumber}`;
  }

  /**
   * Get all sequences for a grant
   */
  async getGrantSequences(grantCode: string) {
    return this.prisma.serialSequence.findMany({
      where: { grantCode },
      orderBy: { docType: 'asc' },
    });
  }

  /**
   * Get all sequences (admin view)
   */
  async getAllSequences() {
    return this.prisma.serialSequence.findMany({
      orderBy: [{ grantCode: 'asc' }, { docType: 'asc' }],
    });
  }

  /**
   * Reset a sequence (admin only — use with extreme caution)
   * Only allowed if no documents have been created with this sequence.
   */
  async resetSequence(grantCode: string, docType: string): Promise<void> {
    this.logger.warn(`Resetting serial sequence: ${grantCode}-${docType}`);
    await this.prisma.serialSequence.updateMany({
      where: { grantCode, docType: docType as ProcurementDocType },
      data: { lastNumber: 0 },
    });
  }

  /**
   * Compute a deterministic integer lock key from grantCode + docType.
   * PostgreSQL advisory locks use bigint keys.
   */
  private computeLockKey(grantCode: string, docType: string): number {
    const str = `${grantCode}:${docType}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit int
    }
    // Ensure positive and within PostgreSQL bigint safe range
    return Math.abs(hash) % 2147483647;
  }
}
