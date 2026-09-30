import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { VerifyAccessDto } from './dto/verify-access.dto.js';

export interface AccessVerificationResult {
  allowed: boolean;
  reason: string;
  user?: {
    id: string;
    name: string;
    facialPhotoUrl?: string | null;
  };
  plan?: string;
  checkInId: string;
  timestamp: Date;
}

@Injectable()
export class AccessService {
  constructor(private readonly prisma: PrismaService) {}

  async verifyAndRecordAccess(dto: VerifyAccessDto): Promise<AccessVerificationResult> {
    const { facialId, userId, deviceId } = dto;

    if (!facialId && !userId) {
      throw new NotFoundException('Identificador facial ou ID do aluno não informado');
    }

    // Buscar usuário pelo facialId ou pelo id direto
    const user = await this.prisma.user.findFirst({
      where: facialId ? { facialId } : { id: userId },
      include: {
        subscriptions: {
          include: {
            plan: true,
          },
          orderBy: {
            currentPeriodEnd: 'desc',
          },
        },
      },
    });

    if (!user) {
      return {
        allowed: false,
        reason: 'Rosto ou Aluno não cadastrado no sistema',
        checkInId: '',
        timestamp: new Date(),
      };
    }

    const now = new Date();
    // Verificar se existe assinatura ativa e dentro da vigência
    const activeSub = user.subscriptions.find(
      (sub) => sub.status === 'ACTIVE' && sub.currentPeriodEnd >= now,
    );

    let allowed = false;
    let reason = '';

    if (activeSub) {
      allowed = true;
      reason = `Acesso Liberado • Plano ${activeSub.plan.name}`;
    } else {
      allowed = false;
      const pastDueSub = user.subscriptions.find((sub) => sub.status === 'PAST_DUE');
      if (pastDueSub) {
        reason = 'Acesso Bloqueado • Mensalidade Pendente';
      } else {
        reason = 'Acesso Bloqueado • Nenhuma assinatura ativa';
      }
    }

    // Registrar o check-in na auditoria
    const checkIn = await this.prisma.checkIn.create({
      data: {
        userId: user.id,
        deviceId: deviceId || 'Catraca Principal',
        status: allowed ? 'ALLOWED' : 'DENIED',
        reason,
      },
    });

    return {
      allowed,
      reason,
      user: {
        id: user.id,
        name: user.name,
        facialPhotoUrl: user.facialPhotoUrl,
      },
      plan: activeSub?.plan.name,
      checkInId: checkIn.id,
      timestamp: checkIn.createdAt,
    };
  }

  async getRecentLogs(limit = 20) {
    return this.prisma.checkIn.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            facialPhotoUrl: true,
          },
        },
      },
    });
  }
}
