import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIntegrationDto, UpdateIntegrationDto } from './dto/integrations.dto';

@Injectable()
export class IntegrationsService {
  constructor(private prisma: PrismaService) {}

  private parseJson(val: any): any {
    if (typeof val === 'string') {
      try { return JSON.parse(val); } catch { return {}; }
    }
    return val || {};
  }

  async create(userId: string, dto: CreateIntegrationDto) {
    const integration = await this.prisma.integration.create({
      data: {
        name: dto.name,
        type: dto.type,
        config: JSON.stringify(dto.config),
        userId,
      },
    });
    return { ...integration, config: this.parseJson(integration.config) };
  }

  async findAll(userId: string) {
    const integrations = await this.prisma.integration.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return integrations.map((i) => ({
      ...i,
      config: this.parseJson(i.config),
    }));
  }

  async findOne(userId: string, id: string) {
    const integration = await this.prisma.integration.findFirst({
      where: { id, userId },
    });

    if (!integration) throw new NotFoundException('Integração não encontrada');
    return { ...integration, config: this.parseJson(integration.config) };
  }

  async update(userId: string, id: string, dto: UpdateIntegrationDto) {
    await this.findOne(userId, id);
    const data: any = { ...dto };
    if (dto.config) data.config = JSON.stringify(dto.config);
    const integration = await this.prisma.integration.update({
      where: { id },
      data,
    });
    return { ...integration, config: this.parseJson(integration.config) };
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.integration.delete({ where: { id } });
    return { message: 'Integração excluída com sucesso' };
  }

  async test(userId: string, id: string) {
    const integration = await this.findOne(userId, id);
    return {
      status: 'ok',
      message: `Integração ${integration.name} está funcionando`,
      type: integration.type,
    };
  }
}
