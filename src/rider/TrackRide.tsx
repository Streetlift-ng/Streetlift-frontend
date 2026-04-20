import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Navigation,
  ScanLine,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { TopBar } from '../components/layout';
import { Avatar, Badge, Button, Card, IconButton, Modal } from '../components/ui';
import { MapView } from '../components/MapView';
import {
  driverPositionForRide,
  rides,
  routeWaitPoints,
  waitPoints,
  type Booking,
} from '../data/mock';

type BoardState = 'not_boarded' | 'scanning' | 'verifying' | 'boarded' | 'mismatch';

export function RiderTrackRide({ booking, onBack }: { booking: Booking; onBack: () => void }) {
  const ride = rides.find((r) => r.id === booking.rideId);
  const stops = ride ? routeWaitPoints(ride.routeName) : [];
  const pickupWp = waitPoints.find((w) => w.name === booking.pickup);
  const dropoffWp = waitPoints.find((w) => w.name === booking.dropoff);

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 8000);
    return () => clearInterval(t);
  }, []);
  const vehiclePos = ride ? driverPositionForRide(ride.id) : null;

  const currentStopIdx = ride ? stops.findIndex((s) => s.waitPoint.name === ride.currentWaitPoint) : -1;
  const pickupStopIdx = stops.findIndex((s) => s.waitPoint.id === pickupWp?.id);
  const etaMinutes = Math.max(1, (pickupStopIdx - currentStopIdx) * 4 + Math.floor((now % 60000) / 30000));

  const [boardState, setBoardState] = useState<BoardState>('not_boarded');

  return (
    <div>
      <TopBar
        title="Track your ride"
        subtitle={`Booking #${booking.id} · ${booking.routeName}`}
        onBack={onBack}
      />

      <main className="max-w-2xl mx-auto px-5 pt-4 pb-6 space-y-5">
        <MapView
          height={360}
          routePath={stops.map((s) => ({ lat: s.waitPoint.lat, lng: s.waitPoint.lng }))}
          stops={stops.map((s, i) => ({
            id: s.waitPoint.id,
            name: s.waitPoint.name,
            position: { lat: s.waitPoint.lat, lng: s.waitPoint.lng },
            label: String(i + 1),
            state:
              i < currentStopIdx
                ? 'past'
                : ride?.currentWaitPoint === s.waitPoint.name
                ? 'current'
                : 'upcoming',
          }))}
          vehicle={vehiclePos ? { position: vehiclePos, label: ride?.vehiclePlate } : undefined}
          pickup={
            pickupWp
              ? { position: { lat: pickupWp.lat, lng: pickupWp.lng }, name: pickupWp.name }
              : undefined
          }
          dropoff={
            dropoffWp
              ? { position: { lat: dropoffWp.lat, lng: dropoffWp.lng }, name: dropoffWp.name }
              : undefined
          }
        />

        {/* Boarding card */}
        <Card padding="md" className={boardState === 'boarded' ? 'border-success/40 bg-success-soft/50' : ''}>
          <div className="flex items-start gap-3">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                boardState === 'boarded' ? 'bg-success text-white' : 'bg-brand-100 text-brand-700'
              }`}
            >
              {boardState === 'boarded' ? <CheckCircle2 size={20} /> : <ScanLine size={20} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-display font-semibold text-text">
                  {boardState === 'boarded' ? 'You are on board' : 'Scan to board'}
                </p>
                {boardState === 'boarded' && (
                  <Badge tone="success">
                    <ShieldCheck size={10} /> Verified
                  </Badge>
                )}
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                {boardState === 'boarded'
                  ? `Confirmed on ${booking.vehiclePlate}. Enjoy your ride.`
                  : `Scan the QR on the dashboard of ${booking.vehiclePlate} when you board to confirm it's the right vehicle.`}
              </p>
            </div>
            {boardState !== 'boarded' && (
              <Button size="sm" leftIcon={ScanLine} onClick={() => setBoardState('scanning')}>
                Scan
              </Button>
            )}
          </div>
        </Card>

        {/* Driver / ride details */}
        <Card padding="md">
          <div className="flex items-center gap-4">
            <Avatar name={booking.driverName} size={48} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-display font-semibold text-text truncate">{booking.driverName}</p>
                <Badge tone={boardState === 'boarded' ? 'success' : 'brand'}>
                  {boardState === 'boarded' ? 'On board' : 'On the way'}
                </Badge>
              </div>
              <p className="text-xs text-text-muted truncate">
                {ride?.vehicleModel} · {booking.vehiclePlate}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <IconButton icon={MessageCircle} label="Chat" variant="outline" />
              <IconButton icon={Phone} label="Call driver" variant="outline" />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 gap-3">
            <Info label="ETA to you" value={boardState === 'boarded' ? 'On board' : `${etaMinutes} min`} />
            <Info label="Now at" value={ride?.currentWaitPoint ?? '—'} />
            <Info label="Seats left" value={`${ride?.seatsAvailable}/${ride?.totalSeats}`} />
          </div>
        </Card>

        {/* Route progress */}
        <Card padding="md">
          <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">Route progress</p>
          <ol className="relative space-y-3">
            {stops.map((s, i) => {
              const state =
                i < currentStopIdx ? 'past' : ride?.currentWaitPoint === s.waitPoint.name ? 'current' : 'upcoming';
              const isPickup = s.waitPoint.id === pickupWp?.id;
              const isDropoff = s.waitPoint.id === dropoffWp?.id;
              return (
                <li key={s.waitPoint.id} className="flex items-start gap-3">
                  <span
                    className={[
                      'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0',
                      state === 'current'
                        ? 'bg-brand-400 text-white'
                        : state === 'past'
                        ? 'bg-ink-200 text-ink-600'
                        : 'bg-surface border-2 border-ink-200 text-text-muted',
                    ].join(' ')}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p
                        className={[
                          'text-sm truncate',
                          state === 'upcoming' ? 'text-text-muted' : 'text-text font-medium',
                        ].join(' ')}
                      >
                        {s.waitPoint.name}
                      </p>
                      {isPickup && <Badge tone="success">Your pickup</Badge>}
                      {isDropoff && <Badge tone="neutral">Your dropoff</Badge>}
                      {state === 'current' && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-brand-700">
                          <MapPin size={10} /> vehicle here
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </Card>

        <div className="flex gap-2">
          <Button variant="outline" leftIcon={Navigation} fullWidth>
            Share live ETA
          </Button>
          <Button variant="outline" leftIcon={Clock} fullWidth>
            Cancel booking
          </Button>
        </div>
      </main>

      <ScannerModal
        state={boardState}
        expectedPlate={booking.vehiclePlate}
        onClose={() => setBoardState('not_boarded')}
        onSetState={setBoardState}
      />
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-[11px] text-text-muted">{label}</p>
      <p className="text-sm font-semibold text-text mt-0.5 truncate">{value}</p>
    </div>
  );
}

// ---------- Scanner modal (simulated camera) ----------

function ScannerModal({
  state,
  expectedPlate,
  onClose,
  onSetState,
}: {
  state: BoardState;
  expectedPlate: string;
  onClose: () => void;
  onSetState: (s: BoardState) => void;
}) {
  const open = state === 'scanning' || state === 'verifying' || state === 'mismatch';

  // Drive the fake scan lifecycle.
  useEffect(() => {
    if (state !== 'scanning') return;
    const t = setTimeout(() => onSetState('verifying'), 2200);
    return () => clearTimeout(t);
  }, [state, onSetState]);

  useEffect(() => {
    if (state !== 'verifying') return;
    const t = setTimeout(() => onSetState('boarded'), 1000);
    return () => clearTimeout(t);
  }, [state, onSetState]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={state === 'mismatch' ? 'Wrong vehicle' : 'Scan boarding QR'}
      footer={
        state === 'mismatch' ? (
          <div className="flex gap-2 w-full">
            <Button variant="outline" fullWidth onClick={onClose}>
              Close
            </Button>
            <Button fullWidth onClick={() => onSetState('scanning')}>
              Try again
            </Button>
          </div>
        ) : state === 'scanning' || state === 'verifying' ? (
          <Button fullWidth variant="outline" onClick={onClose}>
            Cancel
          </Button>
        ) : null
      }
    >
      {state === 'mismatch' ? (
        <div className="text-center py-4 space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-danger-soft text-danger">
            <AlertTriangle size={26} />
          </div>
          <p className="font-display font-semibold text-text">This isn't your booked vehicle</p>
          <p className="text-sm text-text-muted">
            You booked plate <span className="font-semibold text-text">{expectedPlate}</span>. Check the vehicle plate and scan again.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-text-muted text-center">
            Point your camera at the QR displayed on the driver's dashboard.
          </p>
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-ink-900 border border-border">
            {/* Fake camera feed */}
            <div
              className="absolute inset-0 opacity-60"
              style={{
                background:
                  'radial-gradient(1200px 600px at 50% 120%, #2a2a2a 0%, #0a0a0a 60%)',
              }}
            />
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 4px)',
              }}
            />
            {/* Scan window */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-56 h-56">
                <Corner pos="tl" />
                <Corner pos="tr" />
                <Corner pos="bl" />
                <Corner pos="br" />
                {/* Animated scan line */}
                {state === 'scanning' && (
                  <div
                    className="absolute left-2 right-2 h-[2px] bg-brand-400 shadow-[0_0_16px_theme(colors.brand.400)]"
                    style={{ animation: 'scanLine 1.6s ease-in-out infinite alternate' }}
                  />
                )}
                {state === 'verifying' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="px-3 py-1.5 rounded-full bg-success text-white text-xs font-semibold inline-flex items-center gap-2">
                      <ShieldCheck size={14} /> Verifying plate…
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="absolute bottom-3 left-0 right-0 text-center">
              <p className="text-white/80 text-xs font-medium">
                Expected plate <span className="font-mono">{expectedPlate}</span>
              </p>
            </div>
          </div>

          <p className="text-[11px] text-text-faint text-center">
            We verify the rotating code matches your booked vehicle before marking you as boarded.
          </p>
        </div>
      )}
    </Modal>
  );
}

function Corner({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const base = 'absolute w-7 h-7 border-brand-400 border-4';
  const variants = {
    tl: 'top-0 left-0 border-r-0 border-b-0 rounded-tl-lg',
    tr: 'top-0 right-0 border-l-0 border-b-0 rounded-tr-lg',
    bl: 'bottom-0 left-0 border-r-0 border-t-0 rounded-bl-lg',
    br: 'bottom-0 right-0 border-l-0 border-t-0 rounded-br-lg',
  }[pos];
  return <div className={`${base} ${variants}`} />;
}

// Inject the scan-line keyframes once.
if (typeof document !== 'undefined' && !document.getElementById('streetlift-scanner-kf')) {
  const style = document.createElement('style');
  style.id = 'streetlift-scanner-kf';
  style.textContent = `
    @keyframes scanLine {
      0%   { top: 8%;  opacity: 0.4; }
      50%  { opacity: 1; }
      100% { top: 92%; opacity: 0.4; }
    }
  `;
  document.head.appendChild(style);
}

// unused re-export kept to satisfy tree-shake if imports change
export const __ArrowLeft = ArrowLeft;
