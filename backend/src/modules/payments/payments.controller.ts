import { Controller, Post, Get, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { PaymentsService } from './payments.service.js';
import { PaymentWebhookDto } from './dto/webhook.dto.js';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async webhook(@Body() dto: PaymentWebhookDto) {
    return this.paymentsService.handleWebhook(dto);
  }

  @Get('plans')
  async getPlans() {
    return this.paymentsService.getPlans();
  }

  @Post('plans')
  async createPlan(
    @Body() body: { name: string; price: number; durationDays?: number; description?: string },
  ) {
    return this.paymentsService.createPlan(body);
  }
}
