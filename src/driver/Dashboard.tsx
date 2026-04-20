import { useEffect, useMemo, useState } from 'react';
import {
  Play,
  CheckCircle2,
  MapPin,
  Users,
  Clock,
  Car,
  CalendarClock,
  TrendingUp,
  ArrowRight,
  QrCode,
  Radio,
  RefreshCw,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { TopBar } from '../components/layout';
import { Avatar, Badge, Button, Card, IconButton, Modal, SectionHeader, StatCard } from '../components/ui';
import { MapView } from '../components/MapView';
import { routes, waitPoints, trips, waitingRidersByStop, rides } from '../data/mock';

// ---------- Config: "live tracking" simulation ----------

const SEGMENT_SECONDS = 14; // how long each leg between two stops takes in the demo
const TICK_MS = 500;
const BOARDING_CODE_ROTATE_SEC = 60; // rotating security code (like a TOTP)

// Haversine distance in kilometres between two lat/lng points.
function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function DriverDashboard({ onNavigate }: { onNavigate: (tab: 'trips' | 'vehicle') => void }) {
  const [rideStatus, setRideStatus] = useState<'ready' | 'in_progress' | 'completed'>('ready');
  const [currentSeq, setCurrentSeq] = useState(0);
  const [segmentProgress, setSegmentProgress] = useState(0); // 0..1 between current and next stop
  const [qrOpen, setQrOpen] = useState(false);

  const activeRoute = routes[0];
  const routeStops = useMemo(
    () => activeRoute.points
      .slice()
      .sort((a, b) => a.sequence - b.sequence)
      .map((p) => waitPoints.find((w) => w.id === p.waitPointId)!),
    [activeRoute],
  );
  const totalStops = routeStops.length;
  const scheduledTrips = trips.filter((t) => t.status === 'scheduled').slice(0, 3);

  // Auto-advance driver progress when a trip is in progress. This simulates GPS —
  // real app would read watchPosition() and snap to the nearest wait point.
  useEffect(() => {
    if (rideStatus !== 'in_progress') return;
    const timer = setInterval(() => {
      setSegmentProgress((p) => {
        const step = TICK_MS / (SEGMENT_SECONDS * 1000);
        const next = p + step;
        if (next >= 1) {
          // Arrived at next stop.
          setCurrentSeq((seq) => {
            const nextSeq = seq + 1;
            if (nextSeq >= totalStops - 1) {
              // Reached final stop → auto-complete.
              setRideStatus('completed');
              return totalStops - 1;
            }
            return nextSeq;
          });
          return 0;
        }
        return next;
      });
    }, TICK_MS);
    return () => clearInterval(timer);
  }, [rideStatus, totalStops]);

  // Compute the simulated vehicle location + distance to next stop.
  const here = routeStops[currentSeq];
  const next = routeStops[Math.min(currentSeq + 1, totalStops - 1)];
  const vehiclePos = {
    lat: here.lat + (next.lat - here.lat) * segmentProgress,
    lng: here.lng + (next.lng - here.lng) * segmentProgress,
  };
  const totalSegKm = haversineKm(here, next);
  const remainingKm = totalSegKm * (1 - segmentProgress);
  const etaMin = Math.max(0, Math.ceil((SEGMENT_SECONDS * (1 - segmentProgress)) / 6)); // compressed demo ETA

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
              <Button
                leftIcon={Play}
                onClick={() => {
                  setRideStatus('in_progress');
                  setCurrentSeq(0);
                  setSegmentProgress(0);
                }}
              >
                Start trip
              </Button>
              <Button variant="outline">Change route</Button>
            </div>
          </Card>
        ) : (
          <>
            <ActiveRideCard
              stops={routeStops.map((w) => w.name)}
              current={currentSeq}
              segmentProgress={segmentProgress}
              remainingKm={remainingKm}
              etaMin={etaMin}
              onOpenQr={() => setQrOpen(true)}
              onComplete={() => setRideStatus('completed')}
            />
            <LiveRouteMap currentSeq={currentSeq} vehiclePos={vehiclePos} />
          </>
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

      <BoardingQrModal open={qrOpen} onClose={() => setQrOpen(false)} />
    </div>
  );
}

// ---------- Active ride card (auto-advancing) ----------

function ActiveRideCard({
  stops,
  current,
  segmentProgress,
  remainingKm,
  etaMin,
  onOpenQr,
  onComplete,
}: {
  stops: string[];
  current: number;
  segmentProgress: number;
  remainingKm: number;
  etaMin: number;
  onOpenQr: () => void;
  onComplete: () => void;
}) {
  const nextLabel = stops[Math.min(current + 1, stops.length - 1)];
  const atFinal = current >= stops.length - 1;
  return (
    <Card padding="lg" className="border-brand-200 bg-brand-50/60">
      <div className="flex items-center justify-between">
        <Badge tone="brand">
          <Radio size={10} />
          Live tracking
        </Badge>
        <span className="text-xs text-text-muted">
          stop {Math.min(current + 1, stops.length)}/{stops.length}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-[1fr_auto] items-end gap-3">
        <div className="min-w-0">
          <p className="text-xs text-text-muted">{atFinal ? 'Final stop' : 'Heading to'}</p>
          <p className="font-display font-bold text-xl text-text mt-0.5 truncate">{nextLabel}</p>
          <p className="text-xs text-text-muted mt-1">
            from <span className="text-text">{stops[current]}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-text-muted">ETA</p>
          <p className="font-display font-bold text-xl text-text">{etaMin}m</p>
          <p className="text-[11px] text-text-muted">{remainingKm.toFixed(1)} km</p>
        </div>
      </div>

      {/* Progress bar for current segment */}
      {!atFinal && (
        <div className="mt-4">
          <div className="h-2 rounded-full bg-surface overflow-hidden border border-border">
            <div
              className="h-full bg-brand-400 transition-[width] duration-500 ease-linear"
              style={{ width: `${Math.min(100, segmentProgress * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] uppercase tracking-wider text-text-faint mt-1.5 font-medium">
            <span>{stops[current]}</span>
            <span>{nextLabel}</span>
          </div>
        </div>
      )}

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
              <p className={`text-sm ${state === 'future' ? 'text-text-faint' : 'text-text font-medium'}`}>{s}</p>
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
        <Button leftIcon={QrCode} onClick={onOpenQr}>
          Show boarding QR
        </Button>
        <Button variant="outline" leftIcon={CheckCircle2} onClick={onComplete}>
          End trip
        </Button>
        <IconButton icon={Users} label="Passengers" variant="outline" className="ml-auto" />
      </div>
    </Card>
  );
}

// ---------- Boarding QR modal ----------

function BoardingQrModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [code, setCode] = useState(() => rotatingCode());
  const [secondsLeft, setSecondsLeft] = useState(BOARDING_CODE_ROTATE_SEC);

  useEffect(() => {
    if (!open) return;
    setCode(rotatingCode());
    setSecondsLeft(BOARDING_CODE_ROTATE_SEC);
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setCode(rotatingCode());
          return BOARDING_CODE_ROTATE_SEC;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [open]);

  const payload = JSON.stringify({ kind: 'boarding', ride: 101, plate: 'LAG-427-KJA', code });

  return (
    <Modal open={open} onClose={onClose} title="Boarding QR" footer={<Button fullWidth onClick={onClose}>Done</Button>}>
      <div className="space-y-4 py-1">
        <p className="text-sm text-text-muted text-center">
          Passengers scan this to confirm they've boarded the right vehicle. Code rotates every minute.
        </p>

        <div className="flex items-center justify-center">
          <div className="p-4 rounded-2xl bg-white border border-border">
            <QRCodeSVG value={payload} size={200} level="M" />
          </div>
        </div>

        <div className="text-center">
          <p className="text-[11px] uppercase tracking-wider text-text-faint font-medium">Vehicle code</p>
          <p className="font-mono text-lg font-semibold tracking-widest text-text mt-0.5">{code}</p>
          <p className="text-[11px] text-text-muted mt-1 inline-flex items-center gap-1">
            <RefreshCw size={11} /> rotates in {secondsLeft}s
          </p>
        </div>
      </div>
    </Modal>
  );
}

function rotatingCode(): string {
  // 6 random alphanumerics (no 0/O/1/I for legibility).
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 6; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `${out.slice(0, 3)}-${out.slice(3)}`;
}

// ---------- Live route map (uses driver's simulated position) ----------

function LiveRouteMap({
  currentSeq,
  vehiclePos,
}: {
  currentSeq: number;
  vehiclePos: { lat: number; lng: number };
}) {
  const ride = rides.find((r) => r.id === 101)!;
  const activeRoute = routes.find((rt) => rt.name === ride.routeName)!;
  const routeStops = activeRoute.points
    .slice()
    .sort((a, b) => a.sequence - b.sequence)
    .map((p) => waitPoints.find((w) => w.id === p.waitPointId)!);

  const waiting = waitingRidersByStop(ride.id);

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="px-5 py-3 flex items-center justify-between border-b border-border">
        <div>
          <p className="text-sm font-display font-semibold text-text">Live route</p>
          <p className="text-[11px] text-text-muted">Tracking your location automatically</p>
        </div>
        <Badge tone="brand">
          <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" /> Live
        </Badge>
      </div>
      <MapView
        height={280}
        routePath={routeStops.map((s) => ({ lat: s.lat, lng: s.lng }))}
        stops={routeStops.map((s, i) => ({
          id: s.id,
          name: s.name,
          position: { lat: s.lat, lng: s.lng },
          label: String(i + 1),
          state: i < currentSeq ? 'past' : i === currentSeq ? 'current' : 'upcoming',
          badge: i > currentSeq ? `${waiting[s.id] ?? 0} waiting` : undefined,
        }))}
        vehicle={{ position: vehiclePos, label: ride.vehiclePlate }}
        waitingBadges={routeStops
          .map((s, i) => ({
            position: { lat: s.lat, lng: s.lng },
            count: i > currentSeq ? waiting[s.id] ?? 0 : 0,
            name: s.name,
          }))
          .filter((b) => b.count > 0)}
      />
    </Card>
  );
}
