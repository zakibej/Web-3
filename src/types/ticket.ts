export type TicketStatus = 'in_progress' | 'completed' | 'blocked';

export interface Ticket {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  deadline: string;
  status: TicketStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateTicketInput {
  title: string;
  description?: string;
  deadline: string;
}

export interface UpdateTicketInput {
  title?: string;
  description?: string;
  deadline?: string;
  status?: TicketStatus;
}
