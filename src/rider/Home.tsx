import { useMemo, useState } from 'react';
import {
  Search,
  MapPin,
  Navigation,
  Clock,
  Users,
  ArrowRight,
  Wallet as WalletIcon,
  Compass,
  TicketCheck,
  type LucideIcon,
} from 'lucide-react';
import { TopBar } from '../components/layout';
import {
  Avatar,
  Badge,
  Button,
  Card,
  IconButton,
  Input,
  Modal,
  SectionHeader,
} from '../components/ui';
import { rides, waitPoints, routes, walletTxns } from '../data/mock';

export function RiderHome() {
  const [query, setQuery] = useState('');
  const [pickedRide, setPickedRide] = useState<(typeof rides)[number] | null>(null);
  const [pickup, setPickup] = useState<string>('');
  const [dropoff, setDropoff] = useState<string>('');
  const [confirmation, setConfirmation] = useState<null | { from: string; to: string; fare: number; plate: string }>(null);

  const walletBalance = walletTxns[0].balanceAfter;

  const filtered = useMemo(() => {
    if (!query.trim()) return rides;
    const q = query.toLowerCase();
    return rides.filter(
      (r) => r.routeName.toLowerCase().includes(q) || r.currentWaitPoint.toLowerCase().includes(q),
    );
  }, [query]);

  function openBook(rideId: number) {
    const r = rides.find((x) => x.id === rideId);
    if (!r) return;
    setPickedRide(r);
    const route = routes.find((rt) => rt.name === r.routeName);
    if (route) {
      setPickup(waitPoints.find((w) => w.id === route.points[0].waitPointId)?.name ?? '');
      setDropoff(waitPoints.find((w) => w.id === route.points[route.points.length - 1].waitPointId)?.name ?? '');
    }
  }

  function fareForSelection(): number {
    if (!pickedRide) return 0;
    const route = routes.find((rt) => rt.name === pickedRide.routeName);
    if (!route) return 0;
    const pu = route.points.find((p) => waitPoints.find((w) => w.id === p.waitPointId)?.name === pickup);
    const dp = route.points.find((p) => waitPoints.find((w) => w.id === p.waitPointId)?.name === dropoff);
    if (!pu || !dp || dp.sequence <= pu.sequence) return 0;
    return route.points
      .filter((p) => p.sequence >= pu.sequence && p.sequence < dp.sequence)
      .reduce((sum, p) => sum + p.segmentFare, 0);
  }

  function confirmBooking() {
    if (!pickedRide) return;
    setConfirmation({
      from: pickup,
      to: dropoff,
      fare: fareForSelection(),
      plate: pickedRide.vehiclePlate,
    });
    setPickedRide(null);
  }

  return (
    <div>
      <TopBar
        title="Good morning, Amara"
        subtitle="Where are you heading today?"
        right={<Avatar name="Amara Okoye" size={36} />}
      />

      <main className="max-w-2xl mx-auto px-5 pt-4 space-y-6">
        <Card padding="md" className="bg-gradient-to-br from-brand-400 to-brand-500 text-white border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] opacity-80 font-medium">Wallet balance</p>
              <p className="text-3xl font-display font-bold mt-1">₦{walletBalance.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur flex items-center justify-center">
              <WalletIcon size={18} />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button size="sm" variant="secondary" className="bg-white/15 hover:bg-white/25 text-white">
              Top up
            </Button>
            <Button size="sm" variant="secondary" className="bg-transparent border border-white/30 hover:bg-white/10 text-white">
              History
            </Button>
          </div>
        </Card>

        <div>
          <Input
            leftIcon={Search}
            placeholder="Search route, area or wait point"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
            {['Near me', 'Morning rush', 'Lekki axis', 'Mainland', 'Cheapest'].map((f) => (
              <button
                key={f}
                className="shrink-0 px-3.5 h-8 rounded-full border border-border bg-surface text-xs font-medium text-text-muted hover:text-text hover:bg-surface-soft"
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <section>
          <SectionHeader
            title="Rides near you"
            subtitle="Live vehicles you can board at approved wait points"
            action={
              <button className="text-xs font-medium text-brand-700 hover:underline inline-flex items-center gap-1">
                See all <ArrowRight size={12} />
              </button>
            }
          />
          <div className="space-y-3">
            {filtered.map((r) => (
              <RideCard key={r.id} ride={r} onBook={() => openBook(r.id)} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeader title="Saved places" />
          <div className="grid grid-cols-2 gap-3">
            <SavedPlaceCard icon={Compass} title="Work" address="Techno Plaza II" />
            <SavedPlaceCard icon={Navigation} title="Home" address="14 Ikate Street" />
          </div>
        </section>
      </main>

      {/* Booking picker */}
      <Modal
        open={!!pickedRide}
        onClose={() => setPickedRide(null)}
        title="Book this ride"
        footer={
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-text-muted">Total fare</p>
              <p className="font-display font-bold text-lg text-text">
                ₦{fareForSelection().toLocaleString()}
              </p>
            </div>
            <Button onClick={confirmBooking} disabled={!pickup || !dropoff || fareForSelection() === 0}>
              Confirm & pay
            </Button>
          </div>
        }
      >
        {pickedRide && (
          <div className="space-y-4">
            <Card padding="sm" className="border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-text-muted">Route</p>
                  <p className="font-display font-semibold text-text">{pickedRide.routeName}</p>
                </div>
                <Badge tone="success">
                  <TicketCheck size={10} /> {pickedRide.seatsAvailable} seats
                </Badge>
              </div>
            </Card>

            <WaitPointSelect
              label="Pickup wait point"
              value={pickup}
              onChange={setPickup}
              route={pickedRide.routeName}
            />
            <WaitPointSelect
              label="Dropoff wait point"
              value={dropoff}
              onChange={setDropoff}
              route={pickedRide.routeName}
            />

            <div className="flex items-center justify-between text-xs text-text-muted">
              <span className="inline-flex items-center gap-1.5">
                <Clock size={12} /> Vehicle at {pickedRide.currentWaitPoint}
              </span>
              <span>Wallet pays automatically</span>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirmation */}
      <Modal
        open={!!confirmation}
        onClose={() => setConfirmation(null)}
        title="Booking confirmed"
        footer={
          <Button fullWidth onClick={() => setConfirmation(null)}>
            Done
          </Button>
        }
      >
        {confirmation && (
          <div className="space-y-5 py-2">
            <div className="flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-success-soft text-success flex items-center justify-center">
                <TicketCheck size={24} />
              </div>
            </div>
            <div className="text-center">
              <p className="font-display font-semibold text-text text-lg">Seat held for you</p>
              <p className="text-sm text-text-muted">
                Show your booking code to the driver: <span className="font-mono text-text font-semibold">STL-{Math.floor(Math.random() * 9000) + 1000}</span>
              </p>
            </div>
            <Card padding="sm" className="bg-surface-soft border-0">
              <div className="flex justify-between py-1">
                <span className="text-xs text-text-muted">From</span>
                <span className="text-sm font-medium text-text">{confirmation.from}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-xs text-text-muted">To</span>
                <span className="text-sm font-medium text-text">{confirmation.to}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-xs text-text-muted">Vehicle</span>
                <span className="text-sm font-medium text-text">{confirmation.plate}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-xs text-text-muted">Charged</span>
                <span className="text-sm font-semibold text-text">₦{confirmation.fare.toLocaleString()}</span>
              </div>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
}

function RideCard({ ride, onBook }: { ride: (typeof rides)[number]; onBook: () => void }) {
  const pct = (ride.seatsAvailable / ride.totalSeats) * 100;
  return (
    <Card padding="md" interactive onClick={onBook}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
            <Navigation size={18} />
          </div>
          <div className="min-w-0">
            <p className="font-display font-semibold text-text truncate">{ride.routeName}</p>
            <p className="text-xs text-text-muted truncate">
              {ride.vehicleModel} · {ride.vehiclePlate}
            </p>
            <div className="mt-2 flex items-center gap-3 text-[11px] text-text-muted">
              <span className="inline-flex items-center gap-1">
                <MapPin size={11} />
                {ride.currentWaitPoint}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock size={11} />
                started {ride.startedAt}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xs text-text-muted">seats</div>
          <div className="font-display font-bold text-text">
            {ride.seatsAvailable}
            <span className="text-text-faint text-sm font-normal">/{ride.totalSeats}</span>
          </div>
          <div className="mt-1 w-20 h-1 rounded-full bg-ink-150 overflow-hidden">
            <div
              className="h-full bg-brand-400"
              style={{ width: `${100 - pct}%` }}
            />
          </div>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
        <div className="inline-flex items-center gap-2 text-xs text-text-muted">
          <Users size={12} />
          Driver rated 4.9
        </div>
        <span className="text-xs font-medium text-brand-700 inline-flex items-center gap-1">
          Book seat <ArrowRight size={12} />
        </span>
      </div>
    </Card>
  );
}

function SavedPlaceCard({
  icon: Icon,
  title,
  address,
}: {
  icon: LucideIcon;
  title: string;
  address: string;
}) {
  return (
    <Card padding="md" interactive>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-ink-100 text-text-muted flex items-center justify-center">
          <Icon size={16} />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-text text-sm">{title}</p>
          <p className="text-[11px] text-text-muted truncate">{address}</p>
        </div>
      </div>
    </Card>
  );
}

function WaitPointSelect({
  label,
  value,
  onChange,
  route,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  route: string;
}) {
  const r = routes.find((x) => x.name === route);
  const options = r
    ? r.points
        .map((p) => waitPoints.find((w) => w.id === p.waitPointId))
        .filter((w): w is (typeof waitPoints)[number] => !!w)
    : [];

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-text-muted">{label}</label>
      <div className="relative">
        <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-faint" />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-11 rounded-xl border border-border bg-surface text-sm text-text pl-10 pr-3 focus:outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100/60 appearance-none"
        >
          <option value="">Select a wait point</option>
          {options.map((w) => (
            <option key={w.id} value={w.name}>
              {w.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
