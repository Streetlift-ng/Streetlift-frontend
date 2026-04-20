import { Plus, MapPin } from 'lucide-react';
import { AdminTopBar } from '../components/layout';
import { Badge, Button, Card } from '../components/ui';
import { waitPoints } from '../data/mock';

export function AdminWaitPoints() {
  return (
    <>
      <AdminTopBar
        title="Wait points"
        subtitle="Approved pickup and dropoff points across the network"
        actions={
          <Button size="sm" leftIcon={Plus}>
            Add wait point
          </Button>
        }
      />

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl">
        <div className="lg:col-span-2">
          <Card padding="none" className="overflow-hidden">
            <div className="relative aspect-[4/3] bg-ink-100">
              <img
                src="https://picsum.photos/seed/streetlift-map/1200/800"
                className="w-full h-full object-cover grayscale opacity-70"
                alt="Map"
                referrerPolicy="no-referrer"
              />
              {/* Pins */}
              {waitPoints.slice(0, 6).map((w, i) => (
                <div
                  key={w.id}
                  className="absolute -translate-x-1/2 -translate-y-full"
                  style={{ top: `${20 + (i % 3) * 22}%`, left: `${15 + i * 12}%` }}
                >
                  <div className="flex flex-col items-center">
                    <div className="bg-brand-400 text-white rounded-full p-1.5 shadow-md">
                      <MapPin size={14} />
                    </div>
                    <div className="mt-1 px-2 py-0.5 rounded-full bg-surface border border-border shadow-sm text-[10px] text-text font-medium whitespace-nowrap">
                      {w.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-2">
          {waitPoints.map((w) => (
            <Card key={w.id} padding="sm" interactive>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center">
                    <MapPin size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text truncate">{w.name}</p>
                    <p className="text-[11px] text-text-muted">
                      {w.lat.toFixed(3)}, {w.lng.toFixed(3)}
                    </p>
                  </div>
                </div>
                <Badge tone="success">Active</Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
