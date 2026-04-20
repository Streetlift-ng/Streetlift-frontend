import { useState } from 'react';
import { Check, X, Search, FileText, Phone, Mail, IdCard, type LucideIcon } from 'lucide-react';
import { AdminTopBar } from '../components/layout';
import { Avatar, Badge, Button, Card, Input, Modal, SectionHeader, Tabs } from '../components/ui';
import { approvedDrivers, pendingDrivers, type DriverProfile } from '../data/mock';

type DriverTab = 'pending' | 'approved' | 'rejected' | 'suspended';

export function AdminDrivers() {
  const [tab, setTab] = useState<DriverTab>('pending');
  const [selected, setSelected] = useState<DriverProfile | null>(null);

  const items = tab === 'pending' ? pendingDrivers : tab === 'approved' ? approvedDrivers : [];

  return (
    <>
      <AdminTopBar
        title="Driver onboarding"
        subtitle="Review KYC and approve drivers for service"
        actions={
          <Button size="sm" variant="outline" leftIcon={FileText}>
            Export CSV
          </Button>
        }
      />

      <div className="p-6 space-y-5 max-w-7xl">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <Tabs<DriverTab>
            value={tab}
            onChange={setTab}
            items={[
              { id: 'pending', label: 'Pending', count: pendingDrivers.length },
              { id: 'approved', label: 'Approved', count: approvedDrivers.length },
              { id: 'rejected', label: 'Rejected', count: 0 },
              { id: 'suspended', label: 'Suspended', count: 0 },
            ]}
          />
          <div className="w-64">
            <Input leftIcon={Search} placeholder="Search by name, email, license…" />
          </div>
        </div>

        {items.length === 0 ? (
          <Card padding="lg" className="text-center text-sm text-text-muted">
            No drivers in this queue.
          </Card>
        ) : (
          <Card padding="none">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-text-muted uppercase tracking-wider border-b border-border">
                  <th className="px-5 py-3 font-medium">Applicant</th>
                  <th className="px-5 py-3 font-medium">Contact</th>
                  <th className="px-5 py-3 font-medium">License</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((d, i) => (
                  <tr
                    key={d.id}
                    className={`text-sm hover:bg-surface-soft cursor-pointer ${
                      i !== items.length - 1 ? 'border-b border-border' : ''
                    }`}
                    onClick={() => setSelected(d)}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={d.name} size={32} />
                        <div>
                          <p className="font-medium text-text">{d.name}</p>
                          <p className="text-[11px] text-text-faint">ID #{d.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-text-muted">
                      <div>{d.email}</div>
                      <div className="text-[11px] text-text-faint">{d.phone}</div>
                    </td>
                    <td className="px-5 py-3 text-text-muted">
                      <div className="font-mono text-xs">{d.licenseNumber}</div>
                      <div className="text-[11px] text-text-faint">Exp {d.licenseExpiry}</div>
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone={d.status === 'approved' ? 'success' : 'warning'}>
                        <span className="capitalize">{d.status}</span>
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Button size="sm" variant="outline">
                        Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>

      {/* Driver review drawer-modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Driver application"
        footer={
          selected?.status === 'pending' ? (
            <div className="flex justify-end gap-2">
              <Button variant="outline" leftIcon={X}>
                Reject
              </Button>
              <Button leftIcon={Check} onClick={() => setSelected(null)}>
                Approve driver
              </Button>
            </div>
          ) : (
            <Button fullWidth variant="outline" onClick={() => setSelected(null)}>
              Close
            </Button>
          )
        }
      >
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <Avatar name={selected.name} size={56} />
              <div>
                <p className="font-display font-semibold text-text text-lg">{selected.name}</p>
                <Badge tone={selected.status === 'approved' ? 'success' : 'warning'}>
                  <span className="capitalize">{selected.status}</span>
                </Badge>
              </div>
            </div>

            <SectionHeader title="Contact" />
            <div className="grid grid-cols-1 gap-2.5 text-sm">
              <InfoLine icon={Mail} label="Email" value={selected.email} />
              <InfoLine icon={Phone} label="Phone" value={selected.phone} />
              <InfoLine icon={IdCard} label="License" value={`${selected.licenseNumber} · exp ${selected.licenseExpiry}`} />
            </div>

            <SectionHeader title="Documents" />
            <div className="grid grid-cols-2 gap-3">
              {['License', 'Profile photo', 'Vehicle reg.', 'Insurance'].map((label) => (
                <div key={label} className="aspect-square rounded-xl bg-surface-soft border border-border flex flex-col items-center justify-center text-text-muted text-xs">
                  <FileText size={22} />
                  <p className="mt-2">{label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

function InfoLine({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border px-3 py-2">
      <Icon size={14} />
      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-text-muted">{label}</p>
        <p className="text-sm text-text truncate">{value}</p>
      </div>
    </div>
  );
}
