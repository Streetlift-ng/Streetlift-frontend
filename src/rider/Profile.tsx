import { useState, type ReactNode } from 'react';
import {
  ShieldCheck,
  Bell,
  KeyRound,
  LogOut,
  ChevronRight,
  QrCode,
  Mail,
  Phone,
  MapPin,
  Star,
  type LucideIcon,
} from 'lucide-react';
import { TopBar } from '../components/layout';
import { Avatar, Badge, Button, Card, Modal, SectionHeader } from '../components/ui';

export function RiderProfile({ onSignOut }: { onSignOut: () => void }) {
  const [twoFaOpen, setTwoFaOpen] = useState(false);
  const [twoFaEnabled, setTwoFaEnabled] = useState(false);

  return (
    <div>
      <TopBar title="Profile" subtitle="Manage your account and security" />

      <main className="max-w-2xl mx-auto px-5 pt-5 space-y-6">
        <Card padding="lg">
          <div className="flex items-center gap-4">
            <Avatar name="Amara Okoye" size={60} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-xl text-text truncate">Amara Okoye</h2>
                <Badge tone="brand">
                  <Star size={10} /> 4.9
                </Badge>
              </div>
              <p className="text-xs text-text-muted truncate">amara@mail.com</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <Stat label="Trips" value="42" />
            <Stat label="Saved" value="₦ 3.2k" />
            <Stat label="Member" value="8 mo" />
          </div>
        </Card>

        <section>
          <SectionHeader title="Personal info" />
          <Card padding="none">
            <InfoRow icon={Mail} label="Email" value="amara@mail.com" />
            <InfoRow icon={Phone} label="Phone" value="+234 810 222 9900" />
            <InfoRow icon={MapPin} label="Home" value="14 Ikate Street" last />
          </Card>
        </section>

        <section>
          <SectionHeader title="Security" />
          <Card padding="none">
            <SettingRow
              icon={ShieldCheck}
              title="Two-factor authentication"
              description={twoFaEnabled ? 'Enabled via authenticator app' : 'Add an extra layer to your account'}
              action={
                <Button
                  size="sm"
                  variant={twoFaEnabled ? 'outline' : 'primary'}
                  onClick={() => setTwoFaOpen(true)}
                >
                  {twoFaEnabled ? 'Manage' : 'Turn on'}
                </Button>
              }
            />
            <SettingRow icon={KeyRound} title="Change password" description="Last updated 2 months ago" />
            <SettingRow icon={Bell} title="Notifications" description="Trips, wallet, promotions" last />
          </Card>
        </section>

        <Button variant="outline" fullWidth leftIcon={LogOut} onClick={onSignOut}>
          Sign out
        </Button>
      </main>

      {/* 2FA modal */}
      <Modal
        open={twoFaOpen}
        onClose={() => setTwoFaOpen(false)}
        title={twoFaEnabled ? 'Manage 2FA' : 'Set up two-factor auth'}
        footer={
          <div className="flex gap-2 justify-end">
            {twoFaEnabled ? (
              <Button
                variant="danger"
                onClick={() => {
                  setTwoFaEnabled(false);
                  setTwoFaOpen(false);
                }}
              >
                Disable 2FA
              </Button>
            ) : (
              <Button
                onClick={() => {
                  setTwoFaEnabled(true);
                  setTwoFaOpen(false);
                }}
              >
                I've scanned it
              </Button>
            )}
          </div>
        }
      >
        {twoFaEnabled ? (
          <div className="space-y-3 text-sm">
            <p className="text-text">
              2FA is currently <span className="font-semibold">on</span>. You'll be prompted for a 6-digit code on new
              device sign-ins.
            </p>
            <p className="text-text-muted text-xs">
              To disable, confirm with your password and a current authenticator code (simulated).
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-text-muted">
              Scan the QR in your authenticator app (Google Authenticator, 1Password, Authy), then enter the 6-digit
              code to confirm.
            </p>
            <div className="flex justify-center">
              <div className="w-40 h-40 rounded-2xl bg-surface-soft flex items-center justify-center border border-border">
                <QrCode size={96} className="text-ink-700" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-[11px] text-text-faint">Secret (backup)</p>
              <p className="font-mono text-xs text-text-muted tracking-widest">JBSWY3DPEHPK3PXP</p>
            </div>
          </div>
        )}
      </Modal>
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

function InfoRow({
  icon: Icon,
  label,
  value,
  last,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 ${!last ? 'border-b border-border' : ''}`}>
      <div className="w-8 h-8 rounded-lg bg-ink-100 text-text-muted flex items-center justify-center">
        <Icon size={14} />
      </div>
      <div className="flex-1">
        <p className="text-[11px] text-text-muted">{label}</p>
        <p className="text-sm text-text font-medium">{value}</p>
      </div>
      <button className="text-[11px] text-brand-700 font-medium hover:underline">Edit</button>
    </div>
  );
}

function SettingRow({
  icon: Icon,
  title,
  description,
  action,
  last,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  last?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3.5 ${!last ? 'border-b border-border' : ''}`}>
      <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text truncate">{title}</p>
        {description && <p className="text-[11px] text-text-muted truncate">{description}</p>}
      </div>
      {action ?? <ChevronRight size={16} className="text-text-faint" />}
    </div>
  );
}
