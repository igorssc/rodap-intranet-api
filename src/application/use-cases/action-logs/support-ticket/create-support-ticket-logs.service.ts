import { Injectable } from '@nestjs/common';
import { CreateActionLogService } from '../create-action-logs.service';
import { ActionLog, ActionLogType } from '@prisma/client';
import { PartialUserWithMasterData } from '@/application/interfaces/user';
import { CreateSupportTicketActionLogsProps } from '@/application/interfaces/action-logs';
import { PartialSupportTicketWithMasterData } from '@/application/interfaces/support-ticket';

interface CreateSupportTicketLogServiceExecuteProps {
  ticketCreated: PartialSupportTicketWithMasterData;
  actionUser: PartialUserWithMasterData;
}

interface CreateSupportTicketActionLogUseCaseResponse {
  actionLog: ActionLog & CreateSupportTicketActionLogsProps;
}

@Injectable()
export class CreateSupportTicketLogService {
  constructor(private createActionLogService: CreateActionLogService) {}

  async execute({
    ticketCreated,
    actionUser,
  }: CreateSupportTicketLogServiceExecuteProps) {
    const { actionLog } = await this.createActionLogService.execute({
      user_id: actionUser.id,
      action_type: ActionLogType.CREATE_SUPPORT_TICKET,
      action_data: {
        action_user: {
          id: actionUser.id,
          name: actionUser.name,
          email: actionUser.email,
        },
        ticket_created: {
          id: ticketCreated.id,
          title: ticketCreated.title,
        },
      },
    } as CreateSupportTicketActionLogsProps);

    return { actionLog } as CreateSupportTicketActionLogUseCaseResponse;
  }
}
