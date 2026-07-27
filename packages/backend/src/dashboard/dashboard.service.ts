import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(userId: string) {
    const [
      totalContacts,
      totalFlows,
      activeFlows,
      totalMessages,
      activeAutomations,
    ] = await Promise.all([
      this.prisma.contact.count({ where: { userId } }),
      this.prisma.flow.count({ where: { userId } }),
      this.prisma.flow.count({ where: { userId, status: 'ACTIVE' } }),
      this.prisma.message.count({ where: { userId } }),
      this.prisma.automation.count({ where: { userId, isActive: true } }),
    ]);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { messageLimit: true, messagesUsed: true, plan: true },
    });

    const recentMessages = await this.prisma.message.findMany({
      where: { userId },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        contact: { select: { id: true, name: true, phone: true } },
      },
    });

    return {
      stats: {
        totalContacts,
        totalFlows,
        activeFlows,
        totalMessages,
        activeAutomations,
        messageUsage: {
          used: user!.messagesUsed,
          limit: user!.messageLimit,
          percentage: Math.round((user!.messagesUsed / user!.messageLimit) * 100),
        },
      },
      recentMessages,
    };
  }

  async getChartData(userId: string, days: number = 7) {
    const messages = await this.prisma.message.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true },
    });

    const counts: Record<string, number> = {};
    const now = new Date();

    for (const msg of messages) {
      const d = new Date(msg.createdAt);
      const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
      if (diff <= days) {
        const key = d.toISOString().split('T')[0];
        counts[key] = (counts[key] || 0) + 1;
      }
    }

    return Object.entries(counts).map(([date, count]) => ({ date, count }));
  }
}
