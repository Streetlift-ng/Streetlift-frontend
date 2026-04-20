import { useState } from 'react';
import { Car, Check, X, UserCheck, Search, Plus } from 'lucide-react';
import { AdminTopBar } from '../components/layout';
import { Badge, Button, Card, Input, Modal, SectionHeader, Tabs } from '../components/ui';
import { approvedDrivers, vehicles, type Vehicle } from '../data/mock';

type VehicleTab = 'pending' | 'approved' | 'rejected' | 'retired';

export function AdminVehicles() {
  const [tab, setTab] = useState<VehicleTab>('pending');
  const [selected, setSelected] = useState<Vehicle | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignDriverId, setAssignDriverId] = useState<number | null>(null);

  const items = vehicles.filter((v) => v.status === tab);

  return (
    <>
      <AdminTopBar
        title="Fleet vehicles"
        subtitle="Approve vehicles and tie drivers to their cars"
        actions={
          <Button size="sm" leftIcon={Plus}>
            Add vehicle
          </Button>
        }
      />

      <div className="p-6 space-y-5 max-w-7xl">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <Tabs<VehicleTab>
            value={tab}
            onChange={setTab}
            items={[
              { id: 'pending', label: 'Pending', count: vehicles.filter((v) => v.status === 'pending').length },
              { id: 'approved', label: 'Approved', count: vehicles.filter((v) => v.status === 'approved').length },
              { id: 'rejected', label: 'Rejected', count: 0 },
              { id: 'retired', label: 'Retired', count: 0 },
            ]}
          />
          <div className="w-64">
            <Input leftIcon={Search} placeholder="Search plate, make or driver…" />
          </div>
        </div>

        {items.length === 0 ? (
          <Card padding="lg" className="text-center text-sm text-text-muted">
            No vehicles here.
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((v) => (
              <VehicleCard
                key={v.id}
                v={v}
                onOpen={() => setSelected(v)}
                onAssign={() => {
                  setSelected(v);
                  setAssignOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail */}
      <Modal
        open={!!selected && !assignOpen}
        onClose={() => setSelected(null)}
        title="Vehicle details"
        footer={
          selected?.status === 'pending' ? (
            <div className="flex justify-end gap-2">
              <Button variant="outline" leftIcon={X}>
                Reject
              </Button>
              <Button leftIcon={Check} onClick={() => setSelected(null)}>
                Approve
              </Button>
            </div>
          ) : (
            <div className="flex justify-between w-full items-center">
              <Button variant="outline" size="sm">
                Retire
              </Button>
              <Button leftIcon={UserCheck} onClick={() => setAssignOpen(true)}>
                {selected?.driverId ? 'Reassign driver' : 'Assign driver'}
              </Button>
            </div>
          )
        }
      >
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center">
                <Car size={22} />
              </div>
              <div className="min-w-0">
                <p className="font-display font-semibold text-text text-lg truncate">
                  {selected.make} {selected.model} {selected.year}
                </p>
                <p className="text-sm text-text-muted">{selected.plate} · {selected.color}</p>
              </div>
              <Badge tone={selected.status === 'approved' ? 'success' : 'warning'} className="ml-auto">
                <span className="capitalize">{selected.status}</span>
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <KV label="Type" value={selected.vehicleType} />
              <KV label="Seats" value={String(selected.seatCapacity)} />
              <KV label="Year" value={String(selected.year)} />
              <KV label="Color" value={selected.color} />
            </div>

            <SectionHeader title="Driver" />
            {selected.driverId ? (
              <Card padding="sm" className="border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text">
                      {approvedDrivers.find((d) => d.id === selected.driverId)?.name ?? 'Unknown driver'}
                    </p>
                    <p className="text-[11px] text-text-muted">Driver ID #{selected.driverId}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Unassign
                  </Button>
                </div>
              </Card>
            ) : (
              <Card padding="sm" className="border-dashed border-border">
                <p className="text-sm text-text-muted text-center py-2">No driver assigned to this vehicle.</p>
              </Card>
            )}
          </div>
        )}
      </Modal>

      {/* Assign driver */}
      <Modal
        open={assignOpen}
        onClose={() => {
          setAssignOpen(false);
          setAssignDriverId(null);
        }}
        title="Assign driver to vehicle"
        footer={
          <Button
            fullWidth
            disabled={!assignDriverId}
            onClick={() => {
              setAssignOpen(false);
              setSelected(null);
              setAssignDriverId(null);
            }}
          >
            Assign driver
          </Button>
        }
      >
        <div className="space-y-2">
          <p className="text-sm text-text-muted">
            Pick an approved driver. A driver can only be bound to one vehicle at a time.
          </p>
          <div className="space-y-1.5 max-h-72 overflow-auto">
            {approvedDrivers.map((d) => (
              <button
                key={d.id}
                onClick={() => setAssignDriverId(d.id)}
                className={`w-full text-left rounded-xl border px-3 py-2.5 flex items-center justify-between ${
                  assignDriverId === d.id
                    ? 'border-brand-400 bg-brand-50'
                    : 'border-border hover:bg-surface-soft'
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-text">{d.name}</p>
                  <p className="text-[11px] text-text-muted">
                    {d.totalRides} rides · ⭐ {d.rating.toFixed(1)} · {d.vehicleId ? 'assigned elsewhere' : 'unassigned'}
                  </p>
                </div>
                {assignDriverId === d.id && <Check size={16} className="text-brand-700" />}
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
}

function VehicleCard({
  v,
  onOpen,
  onAssign,
}: {
  v: Vehicle;
  onOpen: () => void;
  onAssign: () => void;
}) {
  const driver = approvedDrivers.find((d) => d.id === v.driverId);
  return (
    <Card padding="md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-display font-semibold text-text truncate">
            {v.make} {v.model}
          </p>
          <p className="text-xs text-text-muted">{v.plate} · {v.year}</p>
        </div>
        <Badge tone={v.status === 'approved' ? 'success' : v.status === 'pending' ? 'warning' : 'neutral'}>
          <span className="capitalize">{v.status}</span>
        </Badge>
      </div>

      <div className="mt-4 aspect-[16/9] rounded-xl bg-surface-soft border border-border flex items-center justify-center text-text-faint">
        <Car size={40} />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <Mini label="Type" value={v.vehicleType} />
        <Mini label="Seats" value={String(v.seatCapacity)} />
        <Mini label="Color" value={v.color} />
      </div>

      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
        <div className="text-xs">
          <p className="text-text-muted">Driver</p>
          <p className="text-text font-medium truncate">{driver?.name ?? 'Unassigned'}</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={onOpen}>
            Review
          </Button>
          {v.status === 'approved' && (
            <Button size="sm" onClick={onAssign}>
              {driver ? 'Reassign' : 'Assign'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface-soft border border-border px-2 py-1.5 text-center">
      <p className="text-[10px] text-text-muted uppercase tracking-wide">{label}</p>
      <p className="text-xs font-medium text-text capitalize">{value}</p>
    </div>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border p-3 bg-surface-soft">
      <p className="text-[11px] text-text-muted">{label}</p>
      <p className="text-sm text-text font-medium mt-0.5 capitalize">{value}</p>
    </div>
  );
}
