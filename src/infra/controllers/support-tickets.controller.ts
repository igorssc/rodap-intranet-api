import { CreateMessageFromSupportTicketService } from '@/application/use-cases/support-ticket-messages/create-message-from-support-ticket.service';
import { CreateSupportTicketService } from '@/application/use-cases/support-tickets/create-support-ticket.service';
import { DeleteUniqueSupportTicketService } from '@/application/use-cases/support-tickets/delete-unique-support-ticket.service';
import { FindAllSupportTicketsByCreatorService } from '@/application/use-cases/support-tickets/find-all-support-tickets-by-creator.service';
import { FindAllSupportTicketsByResponsibleService } from '@/application/use-cases/support-tickets/find-all-support-tickets-by-responsible.service';
import { FindAllSupportTicketsService } from '@/application/use-cases/support-tickets/find-all-support-tickets.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CreateSupportTicketDto } from '../dtos/support-tickets/create-support-ticket.dto';
import { User } from '../decorators/user.decorator';
import { User as UserProps } from '@prisma/client';
import { FindAllSupportTicketsDto } from '../dtos/support-tickets/find-all-support-tickets.dto';

@Controller('support-tickets')
export class SupportTicketsController {
  constructor(
    private createMessageFromSupportTicketService: CreateMessageFromSupportTicketService,
    private createSupportTicketService: CreateSupportTicketService,
    private deleteUniqueSupportTicketService: DeleteUniqueSupportTicketService,
    private findAllSupportTicketsByCreatorService: FindAllSupportTicketsByCreatorService,
    private findAllSupportTicketsByResponsibleService: FindAllSupportTicketsByResponsibleService,
    private findAllSupportTicketsService: FindAllSupportTicketsService,
  ) {}

  @Get()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  async findAll(@Query() query: FindAllSupportTicketsDto) {
    const { page, limit } = query;

    return await this.findAllSupportTicketsService.execute({
      page,
      limit,
    });
  }

  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  async createSupportTicket(
    @Body() body: CreateSupportTicketDto,
    @User() user: UserProps,
  ) {
    const { supportTicket } = await this.createSupportTicketService.execute({
      userId: user.id,
      title: body.title,
      description: body.description,
    });

    return supportTicket;
  }

  @Delete(':ticketId')
  @UseGuards(JwtAuthGuard)
  async deleteUnique(@Param('ticketId') ticketId: string) {
    await this.deleteUniqueSupportTicketService.execute(ticketId);
  }
}
