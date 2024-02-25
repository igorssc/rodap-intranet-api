import { Injectable } from '@nestjs/common';
import { ActionLog, ActionLogType } from '@prisma/client';
import { PartialUserWithMasterData } from '@/application/interfaces/user';
import { CreateActionLogService } from '../create-action-logs.service';
import { DeleteSupportTicketActionLogsProps } from '@/application/interfaces/action-logs';
import { PartialSupportTicketWithMasterData } from '@/application/interfaces/support-ticket';

interface DeleteSupportTicketLogServiceExecuteProps {
  ticketDeleted: PartialSupportTicketWithMasterData;
  actionUser: PartialUserWithMasterData;
}

interface DeleteSupportTicketActionLogUseCaseResponse {
  actionLog: ActionLog & DeleteSupportTicketActionLogsProps;
}

@Injectable()
export class DeleteSupportTicketLogService {
  constructor(private createActionLogService: CreateActionLogService) {}

  async execute({
    ticketDeleted,
    actionUser,
  }: DeleteSupportTicketLogServiceExecuteProps) {
    const { actionLog } = await this.createActionLogService.execute({
      user_id: actionUser.id,
      action_type: ActionLogType.DELETE_SUPPORT_TICKET,
      action_data: {
        action_user: {
          id: actionUser.id,
          name: actionUser.name,
          email: actionUser.email,
        },
        ticket_deleted: {
          id: ticketDeleted.id,
          title: ticketDeleted.title,
        },
      },
    } as DeleteSupportTicketActionLogsProps);

    return { actionLog } as DeleteSupportTicketActionLogUseCaseResponse;
  }
}
