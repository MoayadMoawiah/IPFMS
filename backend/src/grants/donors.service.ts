import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { parsePagination, buildPaginationResponse } from '../common/dto/pagination.dto';

@Injectable()
export class DonorsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: any) {
    const { page, limit } = parsePagination(query);
    const { search } = query;
    const where: any = {
      deletedAt: null,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { code: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.donor.findMany({
        where,
        include: { _count: { select: { grants: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.donor.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const donor = await this.prisma.donor.findUnique({
      where: { id, deletedAt: null },
      include: {
        grants: {
          where: { deletedAt: null },
          select: { id: true, code: true, name: true, status: true, totalBudget: true, currency: true },
        },
      },
    });
    if (!donor) throw new NotFoundException(`Donor ${id} not found`);
    return donor;
  }

  async create(dto: any) {
    return this.prisma.donor.create({ data: dto });
  }

  async update(id: string, dto: any) {
    await this.findOne(id);
    return this.prisma.donor.update({ where: { id }, data: dto });
  }

  async softDelete(id: string) {
    const donor = await this.prisma.donor.findUnique({
      where: { id, deletedAt: null },
      include: { _count: { select: { grants: { where: { deletedAt: null } } } } },
    });
    if (!donor) throw new NotFoundException(`Donor ${id} not found`);
    if (donor._count.grants > 0) {
      throw new BadRequestException(
        'Cannot delete a donor that has associated grants. Remove or reassign grants first.',
      );
    }
    await this.prisma.donor.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
