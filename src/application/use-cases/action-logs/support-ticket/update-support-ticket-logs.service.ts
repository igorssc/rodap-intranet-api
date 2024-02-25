import { Injectable } from '@nestjs/common';
import { ActionLog, ActionLogType } from '@prisma/client';
import { PartialUserWithMasterData } from '@/application/interfaces/user';
import { CreateActionLogService } from '../create-action-logs.service';
import { UpdateSupportTicketActionLogsProps } from '@/application/interfaces/action-logs';
import { PartialSupportTicketWithMasterData } from '@/application/interfaces/support-ticket';
import { findDifferentKeys } from '@/application/utils/find-different-keys';

interface UpdateSupportTicketLogServiceExecuteProps {
  ticketUpdated: PartialSupportTicketWithMasterData;
  actionUser: PartialUserWithMasterData;
  ticketUpdatedBefore: PartialSupportTicketWithMasterData;
  ticketUpdatedAfter: PartialSupportTicketWithMasterData;
}

interface UpdateSupportTicketActionLogUseCaseResponse {
  actionLog: ActionLog & UpdateSupportTicketActionLogsProps;
}

@Injectable()
export class UpdateSupportTicketLogService {
  constructor(private createActionLogService: CreateActionLogService) {}

  async execute({
    ticketUpdated,
    actionUser,
    ticketUpdatedBefore,
    ticketUpdatedAfter,
  }: UpdateSupportTicketLogServiceExecuteProps) {
    const keysUpdated = findDifferentKeys(
      ticketUpdatedBefore,
      ticketUpdatedAfter,
    );

    if (keysUpdated.length) {
      const { actionLog } = await this.createActionLogService.execute({
        user_id: actionUser.id,
        action_type: ActionLogType.UPDATE_SUPPORT_TICKET,
        action_data: {
          action_user: {
            id: actionUser.id,
            name: actionUser.name,
            email: actionUser.email,
          },
          ticket_updated: {
            id: ticketUpdated.id,
            title: ticketUpdated.title,
          },
          updated_values: keysUpdated,
        },
      } as UpdateSupportTicketActionLogsProps);

      return { actionLog } as UpdateSupportTicketActionLogUseCaseResponse;
    }

    return {} as UpdateSupportTicketActionLogUseCaseResponse;
  }
}
