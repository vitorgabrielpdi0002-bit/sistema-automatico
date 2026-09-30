import { Controller, Get, Post, Body, Param, Put, Patch, Delete } from '@nestjs/common';
import { MembersService } from './members.service.js';
import { CreateMemberDto } from './dto/create-member.dto.js';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  async create(@Body() dto: CreateMemberDto) {
    return this.membersService.create(dto);
  }

  @Get()
  async findAll() {
    return this.membersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.membersService.findOne(id);
  }

  @Put(':id/facial')
  async updateFacial(
    @Param('id') id: string,
    @Body() body: { facialId: string; facialPhotoUrl?: string },
  ) {
    return this.membersService.updateFacialData(id, body.facialId, body.facialPhotoUrl);
  }

  @Patch(':id/toggle-status')
  async toggleStatus(@Param('id') id: string) {
    return this.membersService.toggleActive(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.membersService.remove(id);
  }
}

