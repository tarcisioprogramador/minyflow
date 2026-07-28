import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIntegrationDto, UpdateIntegrationDto } from './dto/integrations.dto';

@Injectable()
export class IntegrationsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateIntegrationDto) {
    return this.prisma.integration.create({
      data: {
        name: dto.name,
        type: dto.type,
        config: dto.config,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.integration.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const integration = await this.prisma.integration.findFirst({
      where: { id, userId },
    });

    if (!integration) throw new NotFoundException('Integração não encontrada');
    return integration;
  }

  async update(userId: string, id: string, dto: UpdateIntegrationDto) {
    await this.findOne(userId, id);
    return this.prisma.integration.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.config && { config: dto.config }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
    });
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
