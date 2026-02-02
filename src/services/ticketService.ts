import { supabase } from '@/integrations/supabase/client';
import { Ticket, CreateTicketInput, UpdateTicketInput, TicketStatus } from '@/types/ticket';

export async function getTickets(): Promise<Ticket[]> {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return (data || []).map(item => ({
    ...item,
    status: item.status as TicketStatus
  }));
}

export async function createTicket(input: CreateTicketInput, userId: string): Promise<Ticket> {
  const { data, error } = await supabase
    .from('tickets')
    .insert({
      user_id: userId,
      title: input.title,
      description: input.description || null,
      deadline: input.deadline,
      status: 'in_progress' as TicketStatus,
    })
    .select()
    .single();

  if (error) throw error;
  
  return {
    ...data,
    status: data.status as TicketStatus
  };
}

export async function updateTicket(id: string, input: UpdateTicketInput): Promise<Ticket> {
  const { data, error } = await supabase
    .from('tickets')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  
  return {
    ...data,
    status: data.status as TicketStatus
  };
}

export async function deleteTicket(id: string): Promise<void> {
  const { error } = await supabase
    .from('tickets')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
