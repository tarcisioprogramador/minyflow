import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAutomationDto, UpdateAutomationDto } from './dto/automations.dto';

@Injectable()
export class AutomationsService {
  constructor(private prisma: PrismaService) {}

  private parseJson(val: any): any {
    if (typeof val === 'string') {
      try { return JSON.parse(val); } catch { return {}; }
    }
    return val || {};
  }

  async create(userId: string, dto: CreateAutomationDto) {
    const automation = await this.prisma.automation.create({
      data: {
        name: dto.name,
        flowId: dto.flowId,
        trigger: JSON.stringify(dto.trigger),
        userId,
      },
      include: { flow: { select: { id: true, name: true } } },
    });
    return { ...automation, trigger: this.parseJson(automation.trigger) };
  }

  async findAll(userId: string) {
    const automations = await this.prisma.automation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { flow: { select: { id: true, name: true, status: true } } },
    });
    return automations.map((a) => ({
      ...a,
      trigger: this.parseJson(a.trigger),
    }));
  }

  async findOne(userId: string, id: string) {
    const automation = await this.prisma.automation.findFirst({
      where: { id, userId },
      include: { flow: true },
    });

    if (!automation) throw new NotFoundException('Automação não encontrada');
    return { ...automation, trigger: this.parseJson(automation.trigger) };
  }

  async update(userId: string, id: string, dto: UpdateAutomationDto) {
    await this.findOne(userId, id);
    const data: any = { ...dto };
    if (dto.trigger) data.trigger = JSON.stringify(dto.trigger);
    const automation = await this.prisma.automation.update({
      where: { id },
      data,
    });
    return { ...automation, trigger: this.parseJson(automation.trigger) };
  }

  async toggle(userId: string, id: string) {
    const automation = await this.findOne(userId, id);
    const updated = await this.prisma.automation.update({
      where: { id },
      data: { isActive: !automation.isActive },
    });
    return { ...updated, trigger: this.parseJson(updated.trigger) };
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.automation.delete({ where: { id } });
    return { message: 'Automação excluída com sucesso' };
  }
}
