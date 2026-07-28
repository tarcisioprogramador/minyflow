import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBroadcastDto, UpdateBroadcastDto } from './dto/broadcasts.dto';

@Injectable()
export class BroadcastsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateBroadcastDto) {
    return this.prisma.broadcast.create({
      data: {
        name: dto.name,
        content: dto.content,
        channel: dto.channel || 'WHATSAPP',
        targetTags: JSON.stringify(dto.targetTags || []),
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.broadcast.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const broadcast = await this.prisma.broadcast.findFirst({
      where: { id, userId },
    });
    if (!broadcast) throw new NotFoundException('Broadcast nao encontrado');
    return broadcast;
  }

  async update(id: string, userId: string, dto: UpdateBroadcastDto) {
    await this.findOne(id, userId);
    return this.prisma.broadcast.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.content && { content: dto.content }),
        ...(dto.targetTags && { targetTags: JSON.stringify(dto.targetTags) }),
        ...(dto.scheduledAt && { scheduledAt: new Date(dto.scheduledAt) }),
      },
    });
  }

  async send(id: string, userId: string) {
    const broadcast = await this.findOne(id, userId);

    if (broadcast.status === 'SENT' || broadcast.status === 'SENDING') {
      throw new BadRequestException('Broadcast ja foi enviado');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario nao encontrado');

    const targetTags: string[] = JSON.parse(broadcast.targetTags || '[]');

    const where: any = { userId };
    if (targetTags.length > 0) {
      const contacts = await this.prisma.contact.findMany({ where: { userId } });
      const matchingIds = contacts
        .filter((c) => {
          const tags: string[] = JSON.parse(c.tags || '[]');
          return targetTags.some((t) => tags.includes(t));
        })
        .map((c) => c.id);
      where.id = { in: matchingIds };
    }

    const contacts = await this.prisma.contact.findMany({ where });

    if (user.messagesUsed + contacts.length > user.messageLimit) {
      throw new BadRequestException('Limite de mensagens atingido');
    }

    await this.prisma.broadcast.update({
      where: { id },
      data: { status: 'SENDING' },
    });

    let sent = 0;
    let failed = 0;

    for (const contact of contacts) {
      try {
        await this.prisma.message.create({
          data: {
            content: broadcast.content,
            channel: broadcast.channel,
            status: 'SENT',
            contactId: contact.id,
            userId,
            sentAt: new Date(),
          },
        });
        sent++;
      } catch {
        failed++;
      }
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { messagesUsed: { increment: sent } },
    });

    return this.prisma.broadcast.update({
      where: { id },
      data: {
        status: 'SENT',
        sentCount: sent,
        failCount: failed,
        sentAt: new Date(),
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.broadcast.delete({ where: { id } });
  }
}
