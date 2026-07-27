import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async updateProfile(userId: string, data: { name?: string; email?: string }) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, email: true, name: true, plan: true },
    });
  }

  async updatePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) throw new ForbiddenException('Senha atual incorreta');

    const hashed = await bcrypt.hash(newPassword, 12);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    return { message: 'Senha atualizada com sucesso' };
  }

  async getUsageStats(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        messageLimit: true,
        messagesUsed: true,
        plan: true,
        _count: {
          select: {
            contacts: true,
            flows: true,
            messages: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    return {
      ...user,
      remainingMessages: user.messageLimit - user.messagesUsed,
      usagePercentage: Math.round((user.messagesUsed / user.messageLimit) * 100),
    };
  }

  async deleteAccount(userId: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new ForbiddenException('Senha incorreta');

    await this.prisma.user.delete({ where: { id: userId } });
    return { message: 'Conta excluída com sucesso' };
  }
}
