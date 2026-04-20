import { useState } from 'react';
import { Navigation, CheckCircle2, XCircle, Clock, Receipt } from 'lucide-react';
import { TopBar } from '../components/layout';
import { Badge, Card, EmptyState, SectionHeader, Tabs } from '../components/ui';
import { riderBookings, type Booking } from '../data/mock';

type TripTab = 'upcoming' | 'completed' | 'cancelled';

export function RiderTrips() {
  const [tab, setTab] = useState<TripTab>('upcoming');

  const items = riderBookings.filter((b) => {
    if (tab === 'upcoming') return b.status === 'upcoming' || b.status === 'in_progress';
    if (tab === 'completed') return b.status === 'completed';
    return b.status === 'cancelled';
  });

  const counts = {
    upcoming: riderBookings.filter((b) => b.status === 'upcoming' || b.status === 'in_progress').length,
    completed: riderBookings.filter((b) => b.status === 'completed').length,
    cancelled: riderBookings.filter((b) => b.status === 'cancelled').length,
  };

  return (
    <div>
      <TopBar title="My trips" subtitle="Bookings and rider history" />

      <main className="max-w-2xl mx-auto px-5 pt-5 space-y-5">
        <Tabs<TripTab>
          value={tab}
          onChange={setTab}
          items={[
            { id: 'upcoming', label: 'Upcoming', count: counts.upcoming },
            { id: 'completed', label: 'Completed', count: counts.completed },
            { id: 'cancelled', label: 'Cancelled', count: counts.cancelled },
          ]}
        />

        {items.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="No trips here yet"
            description="Your upcoming and past bookings will appear in this space."
          />
        ) : (
          <div className="space-y-3">
            {items.map((b) => (
              <BookingRow key={b.id} b={b} />
            ))}
          </div>
        )}

        <SectionHeader title="Receipts" subtitle="Tax-ready summaries of your trip payments" />
        <Card padding="md" className="bg-surface-soft border-0 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text">Download April statement</p>
            <p className="text-xs text-text-muted">PDF · 4 trips · ₦5,200</p>
          </div>
          <Receipt size={18} className="text-text-muted" />
        </Card>
      </main>
    </div>
  );
}

function BookingRow({ b }: { b: Booking }) {
  const tone = b.status === 'completed' ? 'success' : b.status === 'cancelled' ? 'danger' : 'brand';
  const StatusIcon = b.status === 'completed' ? CheckCircle2 : b.status === 'cancelled' ? XCircle : Clock;

  return (
    <Card padding="md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-ink-100 text-text-muted flex items-center justify-center shrink-0">
            <Navigation size={16} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-display font-semibold text-text truncate">{b.routeName}</p>
              <Badge tone={tone}>
                <StatusIcon size={10} />
                <span className="capitalize">{b.status.replace('_', ' ')}</span>
              </Badge>
            </div>
            <p className="text-xs text-text-muted truncate mt-0.5">
              {b.pickup} → {b.dropoff}
            </p>
            <p className="text-[11px] text-text-faint mt-0.5">
              {b.departureTime} · {b.driverName} · {b.vehiclePlate}
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="font-display font-bold text-text">₦{b.fare.toLocaleString()}</div>
          <button className="text-[11px] text-brand-700 mt-1 hover:underline">View details</button>
        </div>
      </div>
    </Card>
  );
}
