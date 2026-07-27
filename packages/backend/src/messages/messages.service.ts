import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SendMessageDto } from './dto/messages.dto';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async send(userId: string, dto: SendMessageDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    if (user.messagesUsed >= user.messageLimit) {
      throw new BadRequestException('Limite de mensagens atingido. Faça upgrade do seu plano.');
    }

    const contact = await this.prisma.contact.findFirst({
      where: { id: dto.contactId, userId },
    });

    if (!contact) throw new NotFoundException('Contato não encontrado');

    const message = await this.prisma.message.create({
      data: {
        content: dto.content,
        channel: (dto.channel as any) || 'WHATSAPP',
        contactId: dto.contactId,
        userId,
        status: 'SENT',
        sentAt: new Date(),
      },
      include: { contact: { select: { name: true, phone: true } } },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { messagesUsed: { increment: 1 } },
    });

    return message;
  }

  async findAll(
    userId: string,
    query: { contactId?: string; page?: number; limit?: number },
  ) {
    const { contactId, page = 1, limit = 50 } = query;
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (contactId) where.contactId = contactId;

    const [messages, total] = await Promise.all([
      this.prisma.message.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          contact: { select: { id: true, name: true, phone: true } },
        },
      }),
      this.prisma.message.count({ where }),
    ]);

    return {
      data: messages,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
