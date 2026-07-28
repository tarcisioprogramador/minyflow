import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFlowDto, UpdateFlowDto } from './dto/flows.dto';

@Injectable()
export class FlowsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateFlowDto) {
    return this.prisma.flow.create({
      data: {
        name: dto.name,
        description: dto.description,
        userId,
        nodes: [],
        edges: [],
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.flow.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: { select: { automations: true } },
      },
    });
  }

  async findOne(userId: string, flowId: string) {
    const flow = await this.prisma.flow.findFirst({
      where: { id: flowId, userId },
    });

    if (!flow) throw new NotFoundException('Fluxo não encontrado');
    return flow;
  }

  async update(userId: string, flowId: string, dto: UpdateFlowDto) {
    await this.findOne(userId, flowId);
    return this.prisma.flow.update({
      where: { id: flowId },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.status && { status: dto.status }),
        ...(dto.nodes !== undefined && { nodes: dto.nodes }),
        ...(dto.edges !== undefined && { edges: dto.edges }),
      },
    });
  }

  async remove(userId: string, flowId: string) {
    await this.findOne(userId, flowId);
    await this.prisma.flow.delete({ where: { id: flowId } });
    return { message: 'Fluxo excluído com sucesso' };
  }

  async duplicate(userId: string, flowId: string) {
    const original = await this.findOne(userId, flowId);

    return this.prisma.flow.create({
      data: {
        name: `${original.name} (Cópia)`,
        description: original.description || undefined,
        nodes: original.nodes || [],
        edges: original.edges || [],
        userId,
      },
    });
  }

  async toggleStatus(userId: string, flowId: string) {
    const flow = await this.findOne(userId, flowId);
    const newStatus = flow.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';

    return this.prisma.flow.update({
      where: { id: flowId },
      data: { status: newStatus },
    });
  }
}
