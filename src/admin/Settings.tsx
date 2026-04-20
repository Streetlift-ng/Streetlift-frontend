import { LogOut, Shield, Users, CreditCard, Bell, Webhook, type LucideIcon } from 'lucide-react';
import { AdminTopBar } from '../components/layout';
import { Button, Card, SectionHeader } from '../components/ui';

export function AdminSettings({ onSignOut }: { onSignOut: () => void }) {
  return (
    <>
      <AdminTopBar title="Settings" subtitle="Workspace, security and integrations" />

      <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
        <Card padding="md">
          <SectionHeader title="Organization" />
          <div className="space-y-2 text-sm">
            <Row icon={Users} title="Team members" subtitle="2 admins · invite more" />
            <Row icon={Shield} title="Two-factor auth policy" subtitle="Required for admins" />
            <Row icon={Bell} title="Incident notifications" subtitle="Slack + email" />
          </div>
        </Card>

        <Card padding="md">
          <SectionHeader title="Billing & payouts" />
          <div className="space-y-2 text-sm">
            <Row icon={CreditCard} title="Payment gateway" subtitle="Paystack · live keys" />
            <Row icon={Webhook} title="Webhooks" subtitle="2 endpoints · payouts + wallet" />
          </div>
        </Card>

        <Card padding="md" className="lg:col-span-2">
          <SectionHeader title="Session" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text">Sign out of admin console</p>
              <p className="text-xs text-text-muted">You can return from the login screen.</p>
            </div>
            <Button variant="outline" leftIcon={LogOut} onClick={onSignOut}>
              Sign out
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}

function Row({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border px-3 py-2.5 hover:bg-surface-soft cursor-pointer">
      <div className="w-8 h-8 rounded-lg bg-ink-100 text-text-muted flex items-center justify-center">
        <Icon size={14} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text truncate">{title}</p>
        <p className="text-[11px] text-text-muted truncate">{subtitle}</p>
      </div>
    </div>
  );
}
