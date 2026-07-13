import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async globalSearch(query: string, limit = 20) {
    if (!query || query.length < 2) return { results: [], total: 0, query };

    const q = query;

    const [grants, vendors, prs, pos, pvs, assets] = await Promise.all([
      this.prisma.grant.findMany({
        where: {
          deletedAt: null,
          OR: [
            { code: { contains: q, mode: 'insensitive' } },
            { name: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: { id: true, code: true, name: true, status: true },
        take: Math.ceil(limit / 3),
      }),

      this.prisma.vendor.findMany({
        where: {
          deletedAt: null,
          OR: [
            { registrationNumber: { contains: q, mode: 'insensitive' } },
            { name: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: { id: true, registrationNumber: true, name: true },
        take: Math.ceil(limit / 6),
      }),

      this.prisma.purchaseRequisition.findMany({
        where: {
          deletedAt: null,
          OR: [
            { serialNumber: { contains: q, mode: 'insensitive' } },
            { title: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: { id: true, serialNumber: true, title: true, status: true },
        take: Math.ceil(limit / 6),
      }),

      this.prisma.purchaseOrder.findMany({
        where: {
          deletedAt: null,
          OR: [
            { serialNumber: { contains: q, mode: 'insensitive' } },
            { title: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: { id: true, serialNumber: true, title: true, status: true },
        take: Math.ceil(limit / 6),
      }),

      this.prisma.paymentVoucher.findMany({
        where: {
          deletedAt: null,
          OR: [
            { serialNumber: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: { id: true, serialNumber: true, description: true, status: true },
        take: Math.ceil(limit / 6),
      }),

      this.prisma.fixedAsset.findMany({
        where: {
          deletedAt: null,
          OR: [
            { assetCode: { contains: q, mode: 'insensitive' } },
            { name: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: { id: true, assetCode: true, name: true, status: true },
        take: Math.ceil(limit / 6),
      }),
    ]);

    const results = [
      ...grants.map((g) => ({
        id: g.id, type: 'grant', title: g.name,
        subtitle: g.code, status: g.status.toLowerCase(),
        href: `/grants/${g.id}`,
      })),
      ...vendors.map((v) => ({
        id: v.id, type: 'vendor', title: v.name,
        subtitle: v.registrationNumber, status: 'active',
        href: `/procurement/vendors/${v.id}`,
      })),
      ...prs.map((pr) => ({
        id: pr.id, type: 'purchase_requisition', title: pr.title,
        subtitle: pr.serialNumber, status: pr.status.toLowerCase(),
        href: `/procurement/requisitions/${pr.id}`,
      })),
      ...pos.map((po) => ({
        id: po.id, type: 'purchase_order', title: po.title,
        subtitle: po.serialNumber, status: po.status.toLowerCase(),
        href: `/procurement/purchase-orders/${po.id}`,
      })),
      ...pvs.map((pv) => ({
        id: pv.id, type: 'payment_voucher', title: pv.serialNumber,
        subtitle: pv.description, status: pv.status.toLowerCase(),
        href: `/finance/payment-vouchers/${pv.id}`,
      })),
      ...assets.map((a) => ({
        id: a.id, type: 'fixed_asset', title: a.name,
        subtitle: a.assetCode, status: a.status.toLowerCase(),
        href: `/assets/${a.id}`,
      })),
    ].slice(0, limit);

    return { results, total: results.length, query };
  }
}
