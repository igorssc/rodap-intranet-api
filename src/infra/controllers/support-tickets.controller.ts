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
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CreateSupportTicketDto } from '../dtos/support-tickets/create-support-ticket.dto';
import { User } from '../decorators/user.decorator';
import { User as UserProps } from '@prisma/client';
import { FindAllSupportTicketsDto } from '../dtos/support-tickets/find-all-support-tickets.dto';
import { FindAllSupportTicketsByCreatorDto } from '../dtos/support-tickets/find-all-support-tickets-by-creator.dto';
import { FindAllSupportTicketsByResponsibleDto } from '../dtos/support-tickets/find-all-support-tickets-by-responsible.dto';
import { CreateSupportTicketMessageDto } from '../dtos/support-tickets/create-support-ticket-message.dto';
import { FindAllSupportTicketMessagesByCreatorDto } from '../dtos/support-tickets/find-all-support-ticket-messages-by-creator.dto';
import { FindAllMessagesBySupportTicketService } from '@/application/use-cases/support-ticket-messages/find-all-messages-by-support-ticket.service';
import { UpdateSupportTicketDto } from '../dtos/support-tickets/update-support-ticket.dto';
import { UpdateSupportTicketService } from '@/application/use-cases/support-tickets/update-support-ticket.service';

@Controller('support-tickets')
export class SupportTicketsController {
  constructor(
    private createMessageFromSupportTicketService: CreateMessageFromSupportTicketService,
    private createSupportTicketService: CreateSupportTicketService,
    private deleteUniqueSupportTicketService: DeleteUniqueSupportTicketService,
    private findAllSupportTicketsByCreatorService: FindAllSupportTicketsByCreatorService,
    private findAllSupportTicketsByResponsibleService: FindAllSupportTicketsByResponsibleService,
    private findAllSupportTicketsService: FindAllSupportTicketsService,
    private findAllMessagesBySupportTicketService: FindAllMessagesBySupportTicketService,
    private updateSupportTicketService: UpdateSupportTicketService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAllSupportTickets(@Query() query: FindAllSupportTicketsDto) {
    const { page, limit } = query;

    return await this.findAllSupportTicketsService.execute({
      page,
      limit,
    });
  }

  @Get('creator/:creatorId')
  @UseGuards(JwtAuthGuard)
  async findAllSupportTicketsByCreator(
    @Param('creatorId') creatorId: string,
    @Query() query: FindAllSupportTicketsByCreatorDto,
  ) {
    const { page, limit } = query;

    return await this.findAllSupportTicketsByCreatorService.execute({
      page,
      limit,
      creatorId,
    });
  }

  @Get('responsible/:responsibleId')
  @UseGuards(JwtAuthGuard)
  async findAllSupportTicketsByResponsible(
    @Param('responsibleId') responsibleId: string,
    @Query() query: FindAllSupportTicketsByResponsibleDto,
  ) {
    const { page, limit } = query;

    return await this.findAllSupportTicketsByResponsibleService.execute({
      page,
      limit,
      responsibleId,
    });
  }

  @Get('message/:ticketId')
  @UseGuards(JwtAuthGuard)
  async findAllSupportTicketMessagesByTicket(
    @Param('ticketId') ticketId: string,
    @Query() query: FindAllSupportTicketMessagesByCreatorDto,
  ) {
    const { page, limit } = query;

    return await this.findAllMessagesBySupportTicketService.execute({
      page,
      limit,
      ticketId,
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

  @Post('message/:ticketId')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  async createSupportTicketMessage(
    @Body() body: CreateSupportTicketMessageDto,
    @Param('ticketId') ticketId: string,
    @User() user: UserProps,
  ) {
    const { messageSupportTicket } =
      await this.createMessageFromSupportTicketService.execute({
        ticketId,
        senderId: user.id,
        message: body.message,
      });

    return messageSupportTicket;
  }

  @Patch(':ticketId')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('ticketId') ticketId: string,
    @Body() body: UpdateSupportTicketDto,
  ) {
    // const { user: userToBeChanged } = await this.findUniqueUserService.execute(
    //   ticketId,
    // );

    // if (!userToBeChanged) {
    //   throw new BadRequestException(USER_NOT_FOUND);
    // }

    const { supportTicket } = await this.updateSupportTicketService.execute(
      ticketId,
      body,
    );

    return supportTicket;
  }

  @Delete(':ticketId')
  @UseGuards(JwtAuthGuard)
  async deleteUnique(@Param('ticketId') ticketId: string) {
    await this.deleteUniqueSupportTicketService.execute(ticketId);
  }
}
