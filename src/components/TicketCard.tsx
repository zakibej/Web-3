import { useState } from 'react';
import { Ticket, TicketStatus } from '@/types/ticket';
import { useUpdateTicket, useDeleteTicket } from '@/hooks/useTickets';
import { StatusBadge } from './StatusBadge';
import { EditTicketDialog } from './EditTicketDialog';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { format, formatDistanceToNow, isPast, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MoreVertical, Calendar, Clock, CheckCircle2, XCircle, Trash2, AlertTriangle, Pencil } from 'lucide-react';

interface TicketCardProps {
  ticket: Ticket;
}

export function TicketCard({ ticket }: TicketCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const updateTicket = useUpdateTicket();
  const deleteTicket = useDeleteTicket();

  const deadline = new Date(ticket.deadline);
  const isOverdue = isPast(deadline) && ticket.status !== 'completed';
  const isDueToday = isToday(deadline);

  const handleStatusChange = (newStatus: TicketStatus) => {
    updateTicket.mutate({ id: ticket.id, input: { status: newStatus } });
  };

  const handleDelete = () => {
    deleteTicket.mutate(ticket.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card className={`group transition-all duration-200 hover:shadow-md animate-slide-up ${isOverdue ? 'border-status-blocked/50' : ''}`}>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">{ticket.title}</h3>
              {ticket.description && (
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {ticket.description}
                </p>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleStatusChange('in_progress')}>
                  <Clock className="mr-2 h-4 w-4" />
                  En cours
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange('completed')}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Terminé
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange('blocked')}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Bloqué
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between gap-2 mt-3">
            <StatusBadge status={ticket.status} size="sm" />
            <div className={`flex items-center gap-1.5 text-xs ${isOverdue ? 'text-status-blocked font-medium' : isDueToday ? 'text-status-progress font-medium' : 'text-muted-foreground'}`}>
              {isOverdue && <AlertTriangle className="h-3.5 w-3.5" />}
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {isOverdue 
                  ? `En retard de ${formatDistanceToNow(deadline, { locale: fr })}`
                  : isDueToday
                    ? "Aujourd'hui"
                    : format(deadline, 'd MMM yyyy', { locale: fr })
                }
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditTicketDialog 
        ticket={ticket} 
        open={showEditDialog} 
        onOpenChange={setShowEditDialog} 
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce ticket ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le ticket "{ticket.title}" sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
