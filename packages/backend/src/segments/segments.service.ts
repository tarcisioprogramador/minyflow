import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSegmentDto, UpdateSegmentDto, SegmentRuleDto } from './dto/segments.dto';

@Injectable()
export class SegmentsService {
  constructor(private prisma: PrismaService) {}

  private async evaluateRules(userId: string, rules: SegmentRuleDto[]): Promise<number> {
    const contacts = await this.prisma.contact.findMany({ where: { userId } });
    let count = 0;

    for (const contact of contacts) {
      const tags: string[] = JSON.parse(contact.tags || '[]');
      const match = rules.every((rule) => {
        if (rule.field === 'tag') {
          if (rule.operator === 'equals') return tags.includes(rule.value);
          if (rule.operator === 'contains') return tags.some((t) => t.includes(rule.value));
          if (rule.operator === 'not_equals') return !tags.includes(rule.value);
        }
        if (rule.field === 'name') {
          const name = contact.name || '';
          if (rule.operator === 'contains') return name.includes(rule.value);
          if (rule.operator === 'equals') return name === rule.value;
        }
        if (rule.field === 'email') {
          const email = contact.email || '';
          if (rule.operator === 'contains') return email.includes(rule.value);
          if (rule.operator === 'equals') return email === rule.value;
        }
        return false;
      });
      if (match) count++;
    }
    return count;
  }

  async create(userId: string, dto: CreateSegmentDto) {
    const contactCount = await this.evaluateRules(userId, dto.rules);
    return this.prisma.segment.create({
      data: {
        name: dto.name,
        rules: JSON.stringify(dto.rules),
        contactCount,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.segment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const segment = await this.prisma.segment.findFirst({
      where: { id, userId },
    });
    if (!segment) throw new NotFoundException('Segmento nao encontrado');
    return segment;
  }

  async update(id: string, userId: string, dto: UpdateSegmentDto) {
    const segment = await this.findOne(id, userId);
    const rules: SegmentRuleDto[] = dto.rules || JSON.parse(segment.rules || '[]');
    const contactCount = await this.evaluateRules(userId, rules);

    return this.prisma.segment.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.rules && { rules: JSON.stringify(dto.rules) }),
        contactCount,
      },
    });
  }

  async refresh(id: string, userId: string) {
    const segment = await this.findOne(id, userId);
    const rules: SegmentRuleDto[] = JSON.parse(segment.rules || '[]');
    const contactCount = await this.evaluateRules(userId, rules);

    return this.prisma.segment.update({
      where: { id },
      data: { contactCount },
    });
  }

  async getContacts(id: string, userId: string) {
    const segment = await this.findOne(id, userId);
    const rules: SegmentRuleDto[] = JSON.parse(segment.rules || '[]');
    const contacts = await this.prisma.contact.findMany({ where: { userId } });

    return contacts.filter((contact) => {
      const tags: string[] = JSON.parse(contact.tags || '[]');
      return rules.every((rule: SegmentRuleDto) => {
        if (rule.field === 'tag') {
          if (rule.operator === 'equals') return tags.includes(rule.value);
          if (rule.operator === 'contains') return tags.some((t) => t.includes(rule.value));
          if (rule.operator === 'not_equals') return !tags.includes(rule.value);
        }
        if (rule.field === 'name') {
          const name = contact.name || '';
          if (rule.operator === 'contains') return name.includes(rule.value);
          if (rule.operator === 'equals') return name === rule.value;
        }
        if (rule.field === 'email') {
          const email = contact.email || '';
          if (rule.operator === 'contains') return email.includes(rule.value);
          if (rule.operator === 'equals') return email === rule.value;
        }
        return false;
      });
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.segment.delete({ where: { id } });
  }
}
