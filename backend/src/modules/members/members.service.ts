import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateMemberDto } from './dto/create-member.dto.js';

@Injectable()
export class MembersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMemberDto) {
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.email },
          dto.cpf ? { cpf: dto.cpf } : {},
          dto.facialId ? { facialId: dto.facialId } : {},
        ],
      },
    });

    if (existing) {
      throw new ConflictException('Já existe um membro cadastrado com este e-mail, CPF ou biometria facial');
    }

    return this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        cpf: dto.cpf,
        phone: dto.phone,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
        gender: dto.gender,
        emergencyContact: dto.emergencyContact,
        emergencyPhone: dto.emergencyPhone,
        medicalNotes: dto.medicalNotes,
        dueDay: dto.dueDay || 10,
        postalCode: dto.postalCode,
        street: dto.street,
        number: dto.number,
        complement: dto.complement,
        neighborhood: dto.neighborhood,
        city: dto.city,
        state: dto.state,
        active: true,
        passwordHash: 'default_hash_for_member', // Pode ser gerado ou redefinido no primeiro acesso
        facialId: dto.facialId,
        facialPhotoUrl: dto.facialPhotoUrl,
        subscriptions: dto.planId
          ? {
              create: {
                planId: dto.planId,
                status: 'ACTIVE',
                currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
              },
            }
          : undefined,
      },
      include: {
        subscriptions: {
          include: {
            plan: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        subscriptions: {
          include: {
            plan: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        subscriptions: {
          include: {
            plan: true,
          },
        },
        checkIns: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Membro não encontrado');
    }

    return user;
  }

  async updateFacialData(id: string, facialId: string, facialPhotoUrl?: string) {
    return this.prisma.user.update({
      where: { id },
      data: {
        facialId,
        facialPhotoUrl,
      },
    });
  }

  async toggleActive(id: string) {
    const user = await this.findOne(id);
    return this.prisma.user.update({
      where: { id },
      data: {
        active: !user.active,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.user.delete({
      where: { id },
    });
  }
}

