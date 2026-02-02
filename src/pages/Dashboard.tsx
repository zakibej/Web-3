import { useAuth } from '@/contexts/AuthContext';
import { CreateTicketDialog } from '@/components/CreateTicketDialog';
import { TicketList } from '@/components/TicketList';
import { Button } from '@/components/ui/button';
import { Ticket, LogOut, User } from 'lucide-react';

export default function Dashboard() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Ticket className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">TicketFlow</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Gérez vos tâches
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="max-w-[150px] truncate">{user?.email}</span>
              </div>
              <Button variant="outline" size="sm" onClick={signOut} className="gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Mes Tickets</h2>
            <p className="text-muted-foreground mt-1">
              Organisez et suivez vos tâches
            </p>
          </div>
          <CreateTicketDialog />
        </div>

        <TicketList />
      </main>
    </div>
  );
}
