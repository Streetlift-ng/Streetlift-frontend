import { useState } from 'react';
import { Plus, CalendarClock, Clock } from 'lucide-react';
import { AdminTopBar } from '../components/layout';
import { Badge, Button, Card, Input, Modal, SectionHeader, Tabs } from '../components/ui';
import { approvedDrivers, routes, trips, type Trip } from '../data/mock';

type TripTab = 'scheduled' | 'started' | 'completed' | 'cancelled';

export function AdminTrips() {
  const [tab, setTab] = useState<TripTab>('scheduled');
  const [newTripOpen, setNewTripOpen] = useState(false);

  const items = trips.filter((t) => t.status === tab);

  return (
    <>
      <AdminTopBar
        title="Scheduled trips"
        subtitle="Plan departures and assign drivers"
        actions={
          <Button size="sm" leftIcon={Plus} onClick={() => setNewTripOpen(true)}>
            Schedule trip
          </Button>
        }
      />

      <div className="p-6 space-y-5 max-w-7xl">
        <Tabs<TripTab>
          value={tab}
          onChange={setTab}
          items={[
            { id: 'scheduled', label: 'Scheduled', count: trips.filter((t) => t.status === 'scheduled').length },
            { id: 'started', label: 'Started', count: 0 },
            { id: 'completed', label: 'Completed', count: trips.filter((t) => t.status === 'completed').length },
            { id: 'cancelled', label: 'Cancelled', count: 0 },
          ]}
        />

        {items.length === 0 ? (
          <Card padding="lg" className="text-center text-sm text-text-muted">
            No trips in this bucket.
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((t) => (
              <TripCard key={t.id} t={t} />
            ))}
          </div>
        )}
      </div>

      <Modal
        open={newTripOpen}
        onClose={() => setNewTripOpen(false)}
        title="Schedule a new trip"
        footer={
          <Button fullWidth onClick={() => setNewTripOpen(false)}>
            Schedule trip
          </Button>
        }
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-muted">Route</label>
            <select className="w-full h-11 rounded-xl border border-border bg-surface px-3 text-sm focus:outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100/60">
              {routes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <Input label="Departure" type="datetime-local" />
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-muted">Assigned driver (optional)</label>
            <select className="w-full h-11 rounded-xl border border-border bg-surface px-3 text-sm focus:outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100/60">
              <option value="">Leave open for any approved driver</option>
              {approvedDrivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <Input label="Notes" placeholder="Morning rush backup" />
        </div>
      </Modal>
    </>
  );
}

function TripCard({ t }: { t: Trip }) {
  const tone =
    t.status === 'scheduled' ? 'brand' : t.status === 'started' ? 'info' : t.status === 'completed' ? 'success' : 'danger';

  return (
    <Card padding="md">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-display font-semibold text-text">{t.routeName}</p>
          <p className="text-xs text-text-muted inline-flex items-center gap-1.5 mt-0.5">
            <Clock size={11} /> {t.scheduledDeparture}
          </p>
        </div>
        <Badge tone={tone}>
          <span className="capitalize">{t.status}</span>
        </Badge>
      </div>

      <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
        <div>
          <p className="text-[11px] text-text-muted">Driver</p>
          <p className="text-sm font-medium text-text">{t.assignedDriver ?? 'Unassigned'}</p>
        </div>
        <Button size="sm" variant="outline">
          Manage
        </Button>
      </div>

      {t.notes && <p className="text-[11px] text-text-faint mt-3">{t.notes}</p>}
    </Card>
  );
}
