import { useState } from 'react';
import { CalendarClock, Clock, Navigation, CheckCircle2, History } from 'lucide-react';
import { TopBar } from '../components/layout';
import { Badge, Button, Card, EmptyState, Tabs } from '../components/ui';
import { trips } from '../data/mock';

type TripTab = 'scheduled' | 'completed';

export function DriverTrips() {
  const [tab, setTab] = useState<TripTab>('scheduled');

  const items = trips.filter((t) => (tab === 'scheduled' ? t.status === 'scheduled' : t.status === 'completed'));

  return (
    <div>
      <TopBar title="My trip queue" subtitle="Trips scheduled by the operations team" />

      <main className="max-w-2xl mx-auto px-5 pt-5 space-y-5">
        <Tabs<TripTab>
          value={tab}
          onChange={setTab}
          items={[
            { id: 'scheduled', label: 'Scheduled', count: trips.filter((t) => t.status === 'scheduled').length },
            { id: 'completed', label: 'Completed', count: trips.filter((t) => t.status === 'completed').length },
          ]}
        />

        {items.length === 0 ? (
          <EmptyState
            icon={History}
            title="Nothing scheduled"
            description="Trips assigned to you or available to claim will appear here."
          />
        ) : (
          <div className="space-y-3">
            {items.map((t) => (
              <Card key={t.id} padding="md">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
                    <Navigation size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-display font-semibold text-text truncate">{t.routeName}</p>
                      {tab === 'completed' ? (
                        <Badge tone="success">
                          <CheckCircle2 size={10} /> Completed
                        </Badge>
                      ) : t.assignedDriver === 'Seyi Adebayo' ? (
                        <Badge tone="brand">Assigned</Badge>
                      ) : t.assignedDriver ? (
                        <Badge tone="neutral">{t.assignedDriver}</Badge>
                      ) : (
                        <Badge tone="warning">Unassigned</Badge>
                      )}
                    </div>
                    <p className="text-xs text-text-muted mt-1 inline-flex items-center gap-3">
                      <span className="inline-flex items-center gap-1">
                        <Clock size={11} /> {t.scheduledDeparture}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <CalendarClock size={11} /> trip #{t.id}
                      </span>
                    </p>
                    {t.notes && <p className="text-[11px] text-text-faint mt-1">{t.notes}</p>}
                  </div>
                </div>

                {tab === 'scheduled' && (
                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-end gap-2">
                    {t.assignedDriver !== 'Seyi Adebayo' && (
                      <Button size="sm" variant="outline">
                        Claim trip
                      </Button>
                    )}
                    {t.assignedDriver === 'Seyi Adebayo' && <Button size="sm">Start now</Button>}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
