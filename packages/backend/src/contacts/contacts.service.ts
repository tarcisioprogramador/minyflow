import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto, UpdateContactDto, ImportContactsDto } from './dto/contacts.dto';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  private serializeTags(tags?: string[]): string {
    return JSON.stringify(tags || []);
  }

  private deserializeTags(tags: string): string[] {
    try { return JSON.parse(tags); } catch { return []; }
  }

  async create(userId: string, dto: CreateContactDto) {
    const contact = await this.prisma.contact.create({
      data: {
        phone: dto.phone,
        name: dto.name,
        email: dto.email,
        tags: this.serializeTags(dto.tags),
        metadata: dto.metadata || undefined,
        userId,
      },
    });
    return { ...contact, tags: this.deserializeTags(contact.tags) };
  }

  async findAll(
    userId: string,
    query: { search?: string; tag?: string; page?: number; limit?: number },
  ) {
    const { search, tag, page = 1, limit = 50 } = query;
    const skip = (page - 1) * limit;

    const where: any = { userId };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [contacts, total] = await Promise.all([
      this.prisma.contact.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.contact.count({ where }),
    ]);

    let filtered = contacts;
    if (tag) {
      filtered = contacts.filter((c) => {
        const tags = this.deserializeTags(c.tags);
        return tags.includes(tag);
      });
    }

    return {
      data: filtered.map((c) => ({ ...c, tags: this.deserializeTags(c.tags) })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(userId: string, contactId: string) {
    const contact = await this.prisma.contact.findFirst({
      where: { id: contactId, userId },
    });

    if (!contact) throw new NotFoundException('Contato não encontrado');
    return { ...contact, tags: this.deserializeTags(contact.tags) };
  }

  async update(userId: string, contactId: string, dto: UpdateContactDto) {
    await this.findOne(userId, contactId);
    const data: any = { ...dto };
    if (dto.tags) data.tags = this.serializeTags(dto.tags);
    if (dto.metadata) data.metadata = dto.metadata;
    const contact = await this.prisma.contact.update({
      where: { id: contactId },
      data,
    });
    return { ...contact, tags: this.deserializeTags(contact.tags) };
  }

  async remove(userId: string, contactId: string) {
    await this.findOne(userId, contactId);
    await this.prisma.contact.delete({ where: { id: contactId } });
    return { message: 'Contato excluído com sucesso' };
  }

  async import(userId: string, dto: ImportContactsDto) {
    const results = { created: 0, skipped: 0, errors: 0 };

    for (const contact of dto.contacts) {
      try {
        const existing = await this.prisma.contact.findFirst({
          where: { phone: contact.phone, userId },
        });

        if (existing) {
          results.skipped++;
          continue;
        }

        await this.prisma.contact.create({
          data: {
            phone: contact.phone,
            name: contact.name,
            email: contact.email,
            tags: this.serializeTags(contact.tags),
            metadata: contact.metadata || undefined,
            userId,
          },
        });
        results.created++;
      } catch {
        results.errors++;
      }
    }

    return results;
  }

  async getTags(userId: string) {
    const contacts = await this.prisma.contact.findMany({
      where: { userId },
      select: { tags: true },
    });

    const allTags = new Set<string>();
    contacts.forEach((c) => this.deserializeTags(c.tags).forEach((t) => allTags.add(t)));
    return Array.from(allTags).sort();
  }
}
