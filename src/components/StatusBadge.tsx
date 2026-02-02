import { TicketStatus } from '@/types/ticket';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: TicketStatus;
  size?: 'sm' | 'default';
}

const statusConfig: Record<TicketStatus, {
  label: string;
  className: string;
  icon: typeof Clock;
}> = {
  in_progress: {
    label: 'En cours',
    className: 'bg-status-progress text-status-progress-foreground hover:bg-status-progress/90',
    icon: Clock,
  },
  completed: {
    label: 'Terminé',
    className: 'bg-status-completed text-status-completed-foreground hover:bg-status-completed/90',
    icon: CheckCircle2,
  },
  blocked: {
    label: 'Bloqué',
    className: 'bg-status-blocked text-status-blocked-foreground hover:bg-status-blocked/90',
    icon: XCircle,
  },
};

export function StatusBadge({ status, size = 'default' }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge 
      className={`${config.className} ${size === 'sm' ? 'text-xs px-2 py-0.5' : ''} font-medium gap-1.5`}
    >
      <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
      {config.label}
    </Badge>
  );
}
