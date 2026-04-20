import {
  ShieldCheck,
  Bell,
  KeyRound,
  LogOut,
  ChevronRight,
  Star,
  Mail,
  Phone,
  IdCard,
  Headphones,
  type LucideIcon,
} from 'lucide-react';
import { TopBar } from '../components/layout';
import { Avatar, Badge, Button, Card, SectionHeader } from '../components/ui';

export function DriverProfile({ onSignOut }: { onSignOut: () => void }) {
  return (
    <div>
      <TopBar title="My account" subtitle="Driver profile and security" />

      <main className="max-w-2xl mx-auto px-5 pt-5 space-y-6">
        <Card padding="lg">
          <div className="flex items-center gap-4">
            <Avatar name="Seyi Adebayo" size={60} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-xl text-text truncate">Seyi Adebayo</h2>
                <Badge tone="brand">
                  <Star size={10} /> 4.9
                </Badge>
              </div>
              <p className="text-xs text-text-muted truncate">seyi.a@streetlift.app</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <Stat label="Rides" value="218" />
            <Stat label="Acceptance" value="97%" />
            <Stat label="Member" value="14 mo" />
          </div>
        </Card>

        <section>
          <SectionHeader title="Identity & KYC" />
          <Card padding="none">
            <Row icon={IdCard} title="Driver's license" subtitle="LAG-D-111220 · expires Feb 2029" badge={{ label: 'Verified', tone: 'success' }} />
            <Row icon={Mail} title="Email" subtitle="seyi.a@streetlift.app" badge={{ label: 'Verified', tone: 'success' }} />
            <Row icon={Phone} title="Phone" subtitle="+234 813 001 9922" badge={{ label: 'Verified', tone: 'success' }} last />
          </Card>
        </section>

        <section>
          <SectionHeader title="Security" />
          <Card padding="none">
            <Row icon={ShieldCheck} title="Two-factor authentication" subtitle="Protect driver earnings" badge={{ label: 'Off', tone: 'neutral' }} />
            <Row icon={KeyRound} title="Change password" subtitle="Last updated 3 months ago" />
            <Row icon={Bell} title="Notifications" subtitle="Trip alerts, payouts, messages" last />
          </Card>
        </section>

        <section>
          <SectionHeader title="Support" />
          <Card padding="none">
            <Row icon={Headphones} title="Contact operations" subtitle="24/7 driver help line" last />
          </Card>
        </section>

        <Button variant="outline" fullWidth leftIcon={LogOut} onClick={onSignOut}>
          Sign out
        </Button>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface-soft border border-border p-3 text-center">
      <p className="text-xs text-text-muted">{label}</p>
      <p className="font-display font-semibold text-text mt-1">{value}</p>
    </div>
  );
}

function Row({
  icon: Icon,
  title,
  subtitle,
  badge,
  last,
}: {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  badge?: { label: string; tone: 'success' | 'neutral' | 'warning' };
  last?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3.5 ${!last ? 'border-b border-border' : ''}`}>
      <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text truncate">{title}</p>
        {subtitle && <p className="text-[11px] text-text-muted truncate">{subtitle}</p>}
      </div>
      {badge ? <Badge tone={badge.tone}>{badge.label}</Badge> : <ChevronRight size={16} className="text-text-faint" />}
    </div>
  );
}
