import {
  Users,
  Car,
  Navigation,
  TrendingUp,
  UserCheck,
  FileCheck2,
  Plus,
  ArrowUpRight,
} from 'lucide-react';
import { AdminTopBar } from '../components/layout';
import { Badge, Button, Card, SectionHeader, StatCard } from '../components/ui';
import { pendingDrivers, vehicles, rides, trips } from '../data/mock';

export function AdminDashboard({ onNavigate }: { onNavigate: (p: 'drivers' | 'vehicles' | 'trips') => void }) {
  const pendingVehicles = vehicles.filter((v) => v.status === 'pending');

  return (
    <>
      <AdminTopBar
        title="Welcome back, Admin"
        subtitle="Today's operations at a glance"
        actions={
          <Button size="sm" leftIcon={Plus}>
            New trip
          </Button>
        }
      />

      <div className="p-6 space-y-6 max-w-7xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Active rides" value={String(rides.length)} icon={Navigation} tone="brand" />
          <StatCard label="Riders booked today" value="312" icon={Users} delta="+18% vs last Tue" tone="success" />
          <StatCard label="Revenue (today)" value="₦412k" icon={TrendingUp} tone="success" />
          <StatCard label="Drivers online" value="14" icon={UserCheck} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live rides */}
          <div className="lg:col-span-2">
            <SectionHeader
              title="Live rides"
              subtitle="Vehicles currently on route"
              action={
                <button className="text-xs font-medium text-brand-700 hover:underline inline-flex items-center gap-1">
                  View map <ArrowUpRight size={12} />
                </button>
              }
            />
            <Card padding="none">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-text-muted uppercase tracking-wider border-b border-border">
                    <th className="px-5 py-3 font-medium">Route</th>
                    <th className="px-5 py-3 font-medium">Driver</th>
                    <th className="px-5 py-3 font-medium">Vehicle</th>
                    <th className="px-5 py-3 font-medium">Progress</th>
                    <th className="px-5 py-3 font-medium text-right">Seats</th>
                  </tr>
                </thead>
                <tbody>
                  {rides.map((r, i) => (
                    <tr
                      key={r.id}
                      className={`text-sm ${i !== rides.length - 1 ? 'border-b border-border' : ''}`}
                    >
                      <td className="px-5 py-3 font-medium text-text">{r.routeName}</td>
                      <td className="px-5 py-3 text-text-muted">{r.driverName}</td>
                      <td className="px-5 py-3 text-text-muted">{r.vehiclePlate}</td>
                      <td className="px-5 py-3">
                        <Badge tone="brand">at {r.currentWaitPoint}</Badge>
                      </td>
                      <td className="px-5 py-3 text-right text-text">
                        {r.seatsAvailable}/{r.totalSeats}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>

          {/* Approvals */}
          <div className="space-y-5">
            <div>
              <SectionHeader
                title="Approvals"
                action={
                  <button
                    onClick={() => onNavigate('drivers')}
                    className="text-xs font-medium text-brand-700 hover:underline"
                  >
                    Queue →
                  </button>
                }
              />
              <Card padding="md">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-warning-soft text-warning flex items-center justify-center">
                    <UserCheck size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-text text-sm">
                      {pendingDrivers.length} driver applications
                    </p>
                    <p className="text-[11px] text-text-muted">Review license and documents</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => onNavigate('drivers')}>
                    Review
                  </Button>
                </div>
                <div className="mt-3 pt-3 border-t border-border flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-warning-soft text-warning flex items-center justify-center">
                    <Car size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-text text-sm">{pendingVehicles.length} vehicles pending</p>
                    <p className="text-[11px] text-text-muted">Inspect photos and registration</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => onNavigate('vehicles')}>
                    Inspect
                  </Button>
                </div>
              </Card>
            </div>

            <div>
              <SectionHeader title="Today's schedule" />
              <Card padding="none">
                {trips
                  .filter((t) => t.status === 'scheduled')
                  .slice(0, 3)
                  .map((t, i, arr) => (
                    <div
                      key={t.id}
                      className={`flex items-center gap-3 px-4 py-3 ${
                        i !== arr.length - 1 ? 'border-b border-border' : ''
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-ink-100 text-text-muted flex items-center justify-center">
                        <Navigation size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text truncate">{t.routeName}</p>
                        <p className="text-[11px] text-text-muted">
                          {t.scheduledDeparture} · {t.assignedDriver ?? 'Unassigned'}
                        </p>
                      </div>
                      {!t.assignedDriver && <Badge tone="warning">Assign</Badge>}
                    </div>
                  ))}
              </Card>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card padding="md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-text-muted">Weekly revenue</p>
                <p className="font-display font-bold text-2xl text-text mt-1">₦2,184,500</p>
                <p className="text-xs text-success mt-0.5">+9.2% vs last week</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-success-soft text-success flex items-center justify-center">
                <TrendingUp size={18} />
              </div>
            </div>
            <div className="mt-5 flex items-end gap-1 h-20">
              {[32, 45, 28, 52, 61, 73, 82].map((h, i) => (
                <div key={i} className="flex-1 rounded-md bg-brand-200" style={{ height: `${h}%` }} />
              ))}
            </div>
          </Card>

          <Card padding="md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-text-muted">Fleet compliance</p>
                <p className="font-display font-bold text-2xl text-text mt-1">92%</p>
                <p className="text-xs text-text-muted mt-0.5">Documents verified & current</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-info-soft text-info flex items-center justify-center">
                <FileCheck2 size={18} />
              </div>
            </div>
            <div className="mt-5 space-y-2 text-xs">
              <Compliance label="Registration" pct={96} />
              <Compliance label="Insurance" pct={91} />
              <Compliance label="Roadworthiness" pct={88} />
              <Compliance label="Driver KYC" pct={93} />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

function Compliance({ label, pct }: { label: string; pct: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 text-text-muted">{label}</span>
      <div className="flex-1 h-1.5 bg-ink-150 rounded-full overflow-hidden">
        <div className="h-full bg-brand-400" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-8 text-right font-medium text-text">{pct}%</span>
    </div>
  );
}
