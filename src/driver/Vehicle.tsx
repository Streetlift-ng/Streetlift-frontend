import {
  Car,
  FileCheck2,
  FileWarning,
  Upload,
  ShieldCheck,
  Calendar,
  Hash,
  Palette,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { TopBar } from '../components/layout';
import { Badge, Button, Card, SectionHeader } from '../components/ui';
import { vehicles } from '../data/mock';

export function DriverVehicle() {
  const v = vehicles[0]; // driver's assigned approved vehicle

  const docs = [
    { label: 'Vehicle registration', status: 'approved' as const, expires: 'Jan 2028' },
    { label: 'Insurance certificate', status: 'approved' as const, expires: 'Oct 2026' },
    { label: 'Roadworthiness', status: 'expiring' as const, expires: 'May 2026' },
    { label: 'Photo', status: 'approved' as const, expires: undefined },
  ];

  return (
    <div>
      <TopBar title="My vehicle" subtitle="Onboarding, documents and inspection" />

      <main className="max-w-2xl mx-auto px-5 pt-5 space-y-6">
        <Card padding="lg" className="border-border">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
              <Car size={26} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-display font-bold text-xl text-text">
                  {v.make} {v.model} {v.year}
                </h2>
                <Badge tone="success">
                  <ShieldCheck size={10} /> Approved
                </Badge>
              </div>
              <p className="text-sm text-text-muted">Plate {v.plate} · {v.color} · {v.seatCapacity} seats</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <Detail icon={Hash} label="Plate" value={v.plate} />
            <Detail icon={Calendar} label="Year" value={String(v.year)} />
            <Detail icon={Palette} label="Color" value={v.color} />
            <Detail icon={Users} label="Seats" value={String(v.seatCapacity)} />
          </div>
        </Card>

        <section>
          <SectionHeader
            title="Documents"
            action={
              <Button size="sm" variant="outline" leftIcon={Upload}>
                Upload
              </Button>
            }
          />
          <Card padding="none">
            {docs.map((d, i) => (
              <DocRow key={d.label} doc={d} last={i === docs.length - 1} />
            ))}
          </Card>
          <p className="text-[11px] text-text-faint mt-3 px-1">
            Documents are reviewed by operations within 24 hours. Expired documents block new trips.
          </p>
        </section>

        <section>
          <SectionHeader title="Inspection checklist" subtitle="Completed at the start of every shift" />
          <Card padding="md">
            <ul className="space-y-2.5 text-sm">
              {['Tyres & spare', 'Mirrors & indicators', 'Interior cleanliness', 'Fuel & fluids'].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-md bg-success-soft text-success flex items-center justify-center">
                    ✓
                  </span>
                  <span className="text-text">{item}</span>
                  <span className="ml-auto text-[11px] text-text-faint">Today · 06:12</span>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      </main>
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border p-3 bg-surface-soft">
      <p className="text-[11px] text-text-muted inline-flex items-center gap-1">
        <Icon size={11} /> {label}
      </p>
      <p className="text-sm font-medium text-text mt-1">{value}</p>
    </div>
  );
}

function DocRow({
  doc,
  last,
}: {
  doc: { label: string; status: 'approved' | 'expiring' | 'pending'; expires?: string };
  last?: boolean;
}) {
  const tone = doc.status === 'approved' ? 'success' : doc.status === 'expiring' ? 'warning' : 'neutral';
  const Icon = doc.status === 'expiring' ? FileWarning : FileCheck2;
  return (
    <div className={`flex items-center gap-3 px-4 py-3 ${!last ? 'border-b border-border' : ''}`}>
      <div className="w-9 h-9 rounded-xl bg-ink-100 text-text-muted flex items-center justify-center">
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text truncate">{doc.label}</p>
        {doc.expires && <p className="text-[11px] text-text-muted">Expires {doc.expires}</p>}
      </div>
      <Badge tone={tone}>
        {doc.status === 'approved' ? 'Approved' : doc.status === 'expiring' ? 'Expiring soon' : 'Pending'}
      </Badge>
    </div>
  );
}
