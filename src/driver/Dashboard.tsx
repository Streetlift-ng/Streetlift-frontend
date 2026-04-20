import { useState } from 'react';
import {
  Play,
  SkipForward,
  CheckCircle2,
  MapPin,
  Users,
  Clock,
  Car,
  CalendarClock,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { TopBar } from '../components/layout';
import { Avatar, Badge, Button, Card, IconButton, SectionHeader, StatCard } from '../components/ui';
import { routes, waitPoints, trips } from '../data/mock';

export function DriverDashboard({ onNavigate }: { onNavigate: (tab: 'trips' | 'vehicle') => void }) {
  const [rideStatus, setRideStatus] = useState<'offline' | 'ready' | 'in_progress' | 'completed'>('ready');
  const [currentSeq, setCurrentSeq] = useState(0);

  const activeRoute = routes[0];
  const routeStops = activeRoute.points.map((p) => waitPoints.find((w) => w.id === p.waitPointId)!);
  const totalStops = routeStops.length;

  const scheduledTrips = trips.filter((t) => t.status === 'scheduled').slice(0, 3);

  return (
    <div>
      <TopBar
        title="Seyi Adebayo"
        subtitle="Driver · approved"
        right={
          <div className="flex items-center gap-2">
            <Badge tone={rideStatus === 'in_progress' ? 'success' : 'neutral'}>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  rideStatus === 'in_progress' ? 'bg-success animate-pulse' : 'bg-ink-400'
                }`}
              />
              {rideStatus === 'in_progress' ? 'On trip' : 'Idle'}
            </Badge>
            <Avatar name="Seyi Adebayo" size={36} />
          </div>
        }
      />

      <main className="max-w-2xl mx-auto px-5 pt-4 space-y-6">
        {rideStatus !== 'in_progress' ? (
          <Card padding="lg">
            <p className="text-xs text-text-muted font-medium">Ready to drive</p>
            <h2 className="font-display font-bold text-xl text-text mt-1">
              Start a ride on <span className="text-brand-700">{activeRoute.name}</span>
            </h2>
            <p className="text-sm text-text-muted mt-1">
              {totalStops} stops · seat capacity 7 · vehicle LAG-427-KJA
            </p>

            <div className="mt-5 flex items-center gap-2">
              <Button leftIcon={Play} onClick={() => setRideStatus('in_progress')}>
                Start trip
              </Button>
              <Button variant="outline">Change route</Button>
            </div>
          </Card>
        ) : (
          <ActiveRideCard
            stops={routeStops.map((w) => w.name)}
            current={currentSeq}
            onAdvance={() => {
              if (currentSeq < totalStops - 1) setCurrentSeq((v) => v + 1);
              else setRideStatus('completed');
            }}
            onComplete={() => setRideStatus('completed')}
          />
        )}

        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Today's trips" value="6" icon={CalendarClock} tone="brand" />
          <StatCard label="Earnings" value="₦18.4k" icon={TrendingUp} tone="success" delta="+12% vs yesterday" />
          <StatCard label="Seat fill" value="82%" icon={Users} />
        </div>

        <section>
          <SectionHeader
            title="Upcoming trips"
            subtitle="Scheduled by admin — claim or start when ready"
            action={
              <button
                onClick={() => onNavigate('trips')}
                className="text-xs font-medium text-brand-700 hover:underline inline-flex items-center gap-1"
              >
                View all <ArrowRight size={12} />
              </button>
            }
          />
          <div className="space-y-3">
            {scheduledTrips.map((t) => (
              <Card key={t.id} padding="md" interactive>
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-display font-semibold text-text truncate">{t.routeName}</p>
                      {t.assignedDriver === 'Seyi Adebayo' ? (
                        <Badge tone="brand">Assigned to you</Badge>
                      ) : t.assignedDriver ? (
                        <Badge tone="neutral">{t.assignedDriver}</Badge>
                      ) : (
                        <Badge tone="warning">Unassigned</Badge>
                      )}
                    </div>
                    <p className="text-xs text-text-muted mt-0.5 inline-flex items-center gap-1.5">
                      <Clock size={11} /> {t.scheduledDeparture}
                    </p>
                  </div>
                  <Button size="sm" variant={t.assignedDriver === 'Seyi Adebayo' ? 'primary' : 'outline'}>
                    {t.assignedDriver === 'Seyi Adebayo' ? 'Start' : 'Claim'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader title="Vehicle" />
          <Card padding="md" interactive onClick={() => onNavigate('vehicle')}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center">
                <Car size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-text">Toyota Sienna 2019</p>
                <p className="text-xs text-text-muted">LAG-427-KJA · Silver · 7 seats</p>
              </div>
              <Badge tone="success">Approved</Badge>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}

function ActiveRideCard({
  stops,
  current,
  onAdvance,
  onComplete,
}: {
  stops: string[];
  current: number;
  onAdvance: () => void;
  onComplete: () => void;
}) {
  return (
    <Card padding="lg" className="border-brand-200 bg-brand-50/60">
      <div className="flex items-center justify-between">
        <Badge tone="brand">
          <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" /> Trip in progress
        </Badge>
        <span className="text-xs text-text-muted">
          stop {current + 1}/{stops.length}
        </span>
      </div>

      <div className="mt-5">
        <p className="text-xs text-text-muted">Currently at</p>
        <p className="font-display font-bold text-xl text-text mt-0.5">{stops[current]}</p>
      </div>

      <ol className="mt-5 relative border-l-2 border-brand-200 ml-2 space-y-4">
        {stops.map((s, i) => {
          const state = i < current ? 'done' : i === current ? 'here' : 'future';
          return (
            <li key={s} className="pl-5 relative">
              <span
                className={`absolute -left-[9px] top-0.5 w-4 h-4 rounded-full border-2 ${
                  state === 'done'
                    ? 'bg-brand-400 border-brand-400'
                    : state === 'here'
                    ? 'bg-white border-brand-500'
                    : 'bg-white border-ink-300'
                }`}
              />
              <p
                className={`text-sm ${
                  state === 'future' ? 'text-text-faint' : 'text-text font-medium'
                }`}
              >
                {s}
              </p>
              {state === 'here' && (
                <p className="text-[11px] text-brand-700 mt-0.5 inline-flex items-center gap-1">
                  <MapPin size={10} /> You are here
                </p>
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-6 flex items-center gap-2">
        <Button leftIcon={SkipForward} onClick={onAdvance}>
          Next stop
        </Button>
        <Button variant="outline" leftIcon={CheckCircle2} onClick={onComplete}>
          End trip
        </Button>
        <IconButton icon={Users} label="Passengers" variant="outline" className="ml-auto" />
      </div>
    </Card>
  );
}
