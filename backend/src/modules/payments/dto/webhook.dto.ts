import { IsString, IsNumber, IsOptional } from 'class-validator';

export class PaymentWebhookDto {
  @IsString()
  event!: string; // Ex: PAYMENT_RECEIVED, PAYMENT_OVERDUE, SUBSCRIPTION_CANCELED

  @IsString()
  customerId!: string;

  @IsOptional()
  @IsString()
  subscriptionId?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsString()
  paymentId?: string;

  @IsOptional()
  @IsString()
  nextDueDate?: string;
}
