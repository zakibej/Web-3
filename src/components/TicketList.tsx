import { useState } from 'react';
import { useTickets } from '@/hooks/useTickets';
import { TicketStatus } from '@/types/ticket';
import { TicketCard } from './TicketCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ListFilter, LayoutGrid } from 'lucide-react';

const statusFilters: { value: TicketStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'in_progress', label: 'En cours' },
  { value: 'completed', label: 'Terminés' },
  { value: 'blocked', label: 'Bloqués' },
];

export function TicketList() {
  const { data: tickets, isLoading, error } = useTickets();
  const [filter, setFilter] = useState<TicketStatus | 'all'>('all');

  const filteredTickets = tickets?.filter(
    (ticket) => filter === 'all' || ticket.status === filter
  );

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Erreur lors du chargement des tickets</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <ListFilter className="h-4 w-4 text-muted-foreground" />
        {statusFilters.map((status) => (
          <Button
            key={status.value}
            variant={filter === status.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(status.value)}
            className="text-sm"
          >
            {status.label}
            {status.value !== 'all' && tickets && (
              <span className="ml-1.5 text-xs opacity-70">
                ({tickets.filter((t) => t.status === status.value).length})
              </span>
            )}
          </Button>
        ))}
      </div>

      {filteredTickets && filteredTickets.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <LayoutGrid className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-1">
            {filter === 'all' ? 'Aucun ticket' : 'Aucun ticket dans cette catégorie'}
          </h3>
          <p className="text-muted-foreground">
            {filter === 'all' 
              ? 'Créez votre premier ticket pour commencer'
              : 'Essayez un autre filtre'}
          </p>
        </div>
      )}
    </div>
  );
}
