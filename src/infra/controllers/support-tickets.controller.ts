import { CreateMessageFromSupportTicketService } from '@/application/use-cases/support-ticket-messages/create-message-from-support-ticket.service';
import { CreateSupportTicketService } from '@/application/use-cases/support-tickets/create-support-ticket.service';
import { DeleteUniqueSupportTicketService } from '@/application/use-cases/support-tickets/delete-unique-support-ticket.service';
import { FindAllSupportTicketsByCreatorService } from '@/application/use-cases/support-tickets/find-all-support-tickets-by-creator.service';
import { FindAllSupportTicketsByResponsibleService } from '@/application/use-cases/support-tickets/find-all-support-tickets-by-responsible.service';
import { FindAllSupportTicketsService } from '@/application/use-cases/support-tickets/find-all-support-tickets.service';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
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
import {
  RolesAction,
  RolesSubject,
  SupportTicket,
  User as UserProps,
} from '@prisma/client';
import { FindAllSupportTicketsDto } from '../dtos/support-tickets/find-all-support-tickets.dto';
import { FindAllSupportTicketsByCreatorDto } from '../dtos/support-tickets/find-all-support-tickets-by-creator.dto';
import { FindAllSupportTicketsByResponsibleDto } from '../dtos/support-tickets/find-all-support-tickets-by-responsible.dto';
import { CreateSupportTicketMessageDto } from '../dtos/support-tickets/create-support-ticket-message.dto';
import { FindAllSupportTicketMessagesByCreatorDto } from '../dtos/support-tickets/find-all-support-ticket-messages-by-creator.dto';
import { FindAllMessagesBySupportTicketService } from '@/application/use-cases/support-ticket-messages/find-all-messages-by-support-ticket.service';
import { UpdateSupportTicketDto } from '../dtos/support-tickets/update-support-ticket.dto';
import { UpdateSupportTicketService } from '@/application/use-cases/support-tickets/update-support-ticket.service';
import { FindUniqueSupportTicketService } from '@/application/use-cases/support-tickets/find-unique-support-ticket.service';
import {
  INVALID_PERMISSION,
  SUPPORT_TICKET_NOT_FOUND,
} from '@/application/errors/errors.constants';
import { CheckPolicies } from '../decorators/check-guard.decorator';
import { subject } from '@casl/ability';
import { UserWithRoles } from '@/application/interfaces/user';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { CreateSupportTicketLogService } from '@/application/use-cases/action-logs/support-ticket/create-support-ticket-logs.service';
import { DeleteSupportTicketLogService } from '@/application/use-cases/action-logs/support-ticket/delete-support-ticket-logs.service';
import { UpdateSupportTicketLogService } from '@/application/use-cases/action-logs/support-ticket/update-support-ticket-logs.service';

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
    private findUniqueSupportTicketService: FindUniqueSupportTicketService,
    private caslAbilityFactory: CaslAbilityFactory,
    private createSupportTicketLogService: CreateSupportTicketLogService,
    private deleteSupportTicketLogService: DeleteSupportTicketLogService,
    private updateSupportTicketLogService: UpdateSupportTicketLogService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @CheckPolicies(RolesAction.READ, RolesSubject.SUPPORT_TICKET)
  async findAllSupportTickets(@Query() query: FindAllSupportTicketsDto) {
    const { page, limit } = query;

    return await this.findAllSupportTicketsService.execute({
      page,
      limit,
    });
  }

  @Get(':ticketId')
  @UseGuards(JwtAuthGuard)
  @CheckPolicies(RolesAction.READ, RolesSubject.SUPPORT_TICKET)
  async findUniqueSupportTicket(@Param('ticketId') ticketId: string) {
    const { supportTicket } = await this.findUniqueSupportTicketService.execute(
      ticketId,
    );

    return supportTicket;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @CheckPolicies(RolesAction.READ, RolesSubject.SUPPORT_TICKET)
  async findAllMeSupportTickets(
    @Query() query: FindAllSupportTicketsByCreatorDto,
    @User() user: UserProps,
  ) {
    const { page, limit } = query;

    return await this.findAllSupportTicketsByCreatorService.execute({
      page,
      limit,
      creatorId: user.id,
    });
  }

  @Get('creator/:creatorId')
  @UseGuards(JwtAuthGuard)
  @CheckPolicies(RolesAction.READ, RolesSubject.SUPPORT_TICKET)
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
  @CheckPolicies(RolesAction.READ, RolesSubject.SUPPORT_TICKET)
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
  @CheckPolicies(RolesAction.READ, RolesSubject.SUPPORT_TICKET)
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
  @CheckPolicies(RolesAction.CREATE, RolesSubject.SUPPORT_TICKET)
  async createSupportTicket(
    @Body() body: CreateSupportTicketDto,
    @User() user: UserProps,
  ) {
    const { supportTicket } = await this.createSupportTicketService.execute({
      userId: user.id,
      title: body.title,
      description: body.description,
    });

    await this.createSupportTicketLogService.execute({
      actionUser: user,
      ticketCreated: supportTicket,
    });

    return supportTicket;
  }

  @Post('message/:ticketId')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @CheckPolicies(RolesAction.CREATE, RolesSubject.SUPPORT_TICKET)
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
    @User() user: UserProps,
  ) {
    const { supportTicket: currentSupportTicket } =
      await this.findUniqueSupportTicketService.execute(ticketId);

    if (!currentSupportTicket) {
      throw new BadRequestException(SUPPORT_TICKET_NOT_FOUND);
    }

    const ability = this.caslAbilityFactory.createForUser(
      user as UserWithRoles,
    );

    const isAllowed = ability.can(
      RolesAction.UPDATE,
      subject(
        RolesSubject.SUPPORT_TICKET,
        currentSupportTicket as SupportTicket,
      ),
    );

    if (!isAllowed && user.id !== currentSupportTicket.creator_id) {
      throw new ForbiddenException(INVALID_PERMISSION);
    }

    const { supportTicket } = await this.updateSupportTicketService.execute(
      ticketId,
      body,
    );

    await this.updateSupportTicketLogService.execute({
      actionUser: user,
      ticketUpdated: currentSupportTicket,
      ticketUpdatedBefore: currentSupportTicket,
      ticketUpdatedAfter: supportTicket,
    });

    return supportTicket;
  }

  @Delete(':ticketId')
  @UseGuards(JwtAuthGuard)
  @CheckPolicies(RolesAction.DELETE, RolesSubject.SUPPORT_TICKET)
  async deleteUnique(
    @Param('ticketId') ticketId: string,
    @User() user: UserProps,
  ) {
    const supportTicketDeleted =
      await this.deleteUniqueSupportTicketService.execute(ticketId);

    await this.deleteSupportTicketLogService.execute({
      actionUser: user,
      ticketDeleted: supportTicketDeleted,
    });
  }
}
