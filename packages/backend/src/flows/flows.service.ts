import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFlowDto, UpdateFlowDto } from './dto/flows.dto';

@Injectable()
export class FlowsService {
  constructor(private prisma: PrismaService) {}

  private parseJson(val: any): any {
    if (typeof val === 'string') {
      try { return JSON.parse(val); } catch { return []; }
    }
    return val || [];
  }

  async create(userId: string, dto: CreateFlowDto) {
    return this.prisma.flow.create({
      data: {
        name: dto.name,
        description: dto.description,
        userId,
        nodes: '[]',
        edges: '[]',
      },
    });
  }

  async findAll(userId: string) {
    const flows = await this.prisma.flow.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: { select: { automations: true } },
      },
    });
    return flows.map((f) => ({
      ...f,
      nodes: this.parseJson(f.nodes),
      edges: this.parseJson(f.edges),
    }));
  }

  async findOne(userId: string, flowId: string) {
    const flow = await this.prisma.flow.findFirst({
      where: { id: flowId, userId },
    });

    if (!flow) throw new NotFoundException('Fluxo não encontrado');
    return { ...flow, nodes: this.parseJson(flow.nodes), edges: this.parseJson(flow.edges) };
  }

  async update(userId: string, flowId: string, dto: UpdateFlowDto) {
    await this.findOne(userId, flowId);
    const data: any = { ...dto };
    if (dto.nodes) data.nodes = JSON.stringify(dto.nodes);
    if (dto.edges) data.edges = JSON.stringify(dto.edges);
    const flow = await this.prisma.flow.update({
      where: { id: flowId },
      data,
    });
    return { ...flow, nodes: this.parseJson(flow.nodes), edges: this.parseJson(flow.edges) };
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
        nodes: JSON.stringify(original.nodes || []),
        edges: JSON.stringify(original.edges || []),
        userId,
      },
    });
  }

  async toggleStatus(userId: string, flowId: string) {
    const flow = await this.findOne(userId, flowId);
    const newStatus = flow.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';

    const updated = await this.prisma.flow.update({
      where: { id: flowId },
      data: { status: newStatus },
    });
    return { ...updated, nodes: this.parseJson(updated.nodes), edges: this.parseJson(updated.edges) };
  }
}
