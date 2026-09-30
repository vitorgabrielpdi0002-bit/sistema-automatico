import { Controller, Post, Get, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { AccessService } from './access.service.js';
import { VerifyAccessDto } from './dto/verify-access.dto.js';

@Controller('access')
export class AccessController {
  constructor(private readonly accessService: AccessService) {}

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verify(@Body() dto: VerifyAccessDto) {
    return this.accessService.verifyAndRecordAccess(dto);
  }

  @Get('logs')
  async getLogs(@Query('limit') limit?: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : 20;
    return this.accessService.getRecentLogs(parsedLimit);
  }
}
