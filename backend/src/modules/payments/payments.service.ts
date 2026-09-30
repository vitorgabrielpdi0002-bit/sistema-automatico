import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { PaymentWebhookDto } from './dto/webhook.dto.js';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async handleWebhook(dto: PaymentWebhookDto) {
    this.logger.log(`Processando webhook: ${dto.event} para cliente ${dto.customerId}`);

    // Buscar a assinatura pelo gatewaySubId ou pelo cliente
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        OR: [
          dto.subscriptionId ? { gatewaySubId: dto.subscriptionId } : {},
          { gatewayCustomerId: dto.customerId },
        ],
      },
      include: {
        user: true,
      },
    });

    if (!subscription) {
      this.logger.warn(`Assinatura não localizada para o cliente ${dto.customerId}`);
      return { received: true, processed: false, reason: 'Assinatura não encontrada' };
    }

    switch (dto.event) {
      case 'PAYMENT_RECEIVED':
      case 'PAYMENT_CONFIRMED': {
        const nextPeriodEnd = dto.nextDueDate
          ? new Date(dto.nextDueDate)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        // Atualizar assinatura para ATIVA e renovar a vigência
        await this.prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            status: 'ACTIVE',
            currentPeriodEnd: nextPeriodEnd,
          },
        });

        // Registrar o pagamento recebido
        if (dto.amount) {
          await this.prisma.payment.create({
            data: {
              userId: subscription.userId,
              subscriptionId: subscription.id,
              amount: dto.amount,
              status: 'PAID',
              gatewayPaymentId: dto.paymentId || `pay_${Date.now()}`,
              paidAt: new Date(),
            },
          });
        }

        this.logger.log(`Acesso liberado para ${subscription.user.name} até ${nextPeriodEnd.toISOString()}`);
        return { received: true, processed: true, action: 'SUBSCRIPTION_RENEWED' };
      }

      case 'PAYMENT_OVERDUE': {
        // Bloquear status da assinatura
        await this.prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            status: 'PAST_DUE',
          },
        });

        this.logger.warn(`Assinatura de ${subscription.user.name} alterada para PAST_DUE (Catraca bloqueada)`);
        return { received: true, processed: true, action: 'SUBSCRIPTION_BLOCKED' };
      }

      case 'SUBSCRIPTION_CANCELED': {
        await this.prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            status: 'CANCELED',
          },
        });

        return { received: true, processed: true, action: 'SUBSCRIPTION_CANCELED' };
      }

      default:
        this.logger.log(`Evento ignorado ou sem ação necessária: ${dto.event}`);
        return { received: true, processed: true, action: 'NO_OP' };
    }
  }

  async getPlans() {
    return this.prisma.plan.findMany({
      where: { active: true },
    });
  }

  async createPlan(data: { name: string; price: number; durationDays?: number; description?: string }) {
    return this.prisma.plan.create({
      data: {
        name: data.name,
        price: data.price,
        durationDays: data.durationDays || 30,
        description: data.description,
      },
    });
  }
}
