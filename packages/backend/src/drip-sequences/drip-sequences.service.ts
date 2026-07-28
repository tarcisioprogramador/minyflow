import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDripSequenceDto, UpdateDripSequenceDto } from './dto/drip-sequences.dto';

@Injectable()
export class DripSequencesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateDripSequenceDto) {
    return this.prisma.dripSequence.create({
      data: {
        name: dto.name,
        description: dto.description,
        steps: JSON.stringify(dto.steps),
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.dripSequence.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { enrollments: true } } },
    });
  }

  async findOne(id: string, userId: string) {
    const drip = await this.prisma.dripSequence.findFirst({
      where: { id, userId },
      include: {
        enrollments: {
          include: { contact: { select: { id: true, name: true, phone: true } } },
          take: 20,
        },
      },
    });
    if (!drip) throw new NotFoundException('Sequencia nao encontrada');
    return drip;
  }

  async update(id: string, userId: string, dto: UpdateDripSequenceDto) {
    await this.findOne(id, userId);
    return this.prisma.dripSequence.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
        ...(dto.steps && { steps: JSON.stringify(dto.steps) }),
      },
    });
  }

  async enroll(userId: string, dripId: string, contactId: string) {
    const drip = await this.findOne(dripId, userId);

    const contact = await this.prisma.contact.findFirst({
      where: { id: contactId, userId },
    });
    if (!contact) throw new NotFoundException('Contato nao encontrado');

    const existing = await this.prisma.dripEnrollment.findFirst({
      where: { dripId, contactId, status: 'ACTIVE' },
    });
    if (existing) throw new BadRequestException('Contato ja esta nesta sequencia');

    const steps = JSON.parse(drip.steps || '[]');
    const firstStepDelay = steps[0]?.delayMinutes || 0;
    const nextRunAt = new Date(Date.now() + firstStepDelay * 60 * 1000);

    return this.prisma.dripEnrollment.create({
      data: {
        dripId,
        contactId,
        nextRunAt,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.dripSequence.delete({ where: { id } });
  }
}
