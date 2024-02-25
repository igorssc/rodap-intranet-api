import { ActionLogType, SupportTicket, User } from '@prisma/client';

type PartialUser = Pick<User, 'id' | 'name' | 'email'>;

type PartialSupportTicket = Pick<SupportTicket, 'id' | 'title'>;

export type CreateUserActionLogsProps = {
  user_id: string;
  action_type: typeof ActionLogType.CREATE_USER;
  action_data: {
    action_user: PartialUser;
    user_created: PartialUser;
  };
};

export type DeleteUserActionLogsProps = {
  user_id: string;
  action_type: typeof ActionLogType.DELETE_USER;
  action_data: {
    action_user: PartialUser;
    user_deleted: PartialUser;
  };
};

export type UpdateUserActionLogsProps = {
  user_id: string;
  action_type: typeof ActionLogType.UPDATE_USER;
  action_data: {
    action_user: PartialUser;
    user_updated: PartialUser;
    updated_values: string[];
  };
};

export type UpdateMeActionLogsProps = {
  user_id: string;
  action_type: typeof ActionLogType.UPDATE_PROFILE;
  action_data: {
    action_user: PartialUser;
    updated_values: string[];
  };
};

export type CreateSupportTicketActionLogsProps = {
  user_id: string;
  action_type: typeof ActionLogType.CREATE_SUPPORT_TICKET;
  action_data: {
    action_user: PartialUser;
    ticket_created: PartialSupportTicket;
  };
};

export type DeleteSupportTicketActionLogsProps = {
  user_id: string;
  action_type: typeof ActionLogType.DELETE_SUPPORT_TICKET;
  action_data: {
    action_user: PartialUser;
    ticket_deleted: PartialSupportTicket;
  };
};

export type UpdateSupportTicketActionLogsProps = {
  user_id: string;
  action_type: typeof ActionLogType.UPDATE_SUPPORT_TICKET;
  action_data: {
    action_user: PartialUser;
    ticket_updated: PartialSupportTicket;
    updated_values: string[];
  };
};
