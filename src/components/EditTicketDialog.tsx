import { useState, useEffect } from 'react';
import { Ticket } from '@/types/ticket';
import { useUpdateTicket } from '@/hooks/useTickets';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface EditTicketDialogProps {
  ticket: Ticket;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTicketDialog({ ticket, open, onOpenChange }: EditTicketDialogProps) {
  const [title, setTitle] = useState(ticket.title);
  const [description, setDescription] = useState(ticket.description || '');
  const [deadline, setDeadline] = useState('');
  const updateTicket = useUpdateTicket();
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setTitle(ticket.title);
      setDescription(ticket.description || '');
      setDeadline(format(new Date(ticket.deadline), 'yyyy-MM-dd'));
    }
  }, [open, ticket]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !deadline) return;

    try {
      await updateTicket.mutateAsync({
        id: ticket.id,
        input: {
          title: title.trim(),
          description: description.trim() || null,
          deadline: new Date(deadline).toISOString(),
        },
      });

      toast({
        title: "Ticket modifié",
        description: "Les modifications ont été enregistrées",
      });

      onOpenChange(false);
    } catch (error) {
      // Error handled by the hook
    }
  };

  const today = format(new Date(), 'yyyy-MM-dd');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier le ticket</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Titre *</Label>
            <Input
              id="edit-title"
              placeholder="Nom de la tâche"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              placeholder="Décrivez la tâche (optionnel)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-deadline">Date limite *</Label>
            <Input
              id="edit-deadline"
              type="date"
              min={today}
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={updateTicket.isPending}>
              {updateTicket.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enregistrer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
