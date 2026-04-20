import { Plus, MapPin } from 'lucide-react';
import { AdminTopBar } from '../components/layout';
import { Badge, Button, Card } from '../components/ui';
import { MapView } from '../components/MapView';
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

      <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl">
        <div className="lg:col-span-2">
          <MapView
            height={520}
            stops={waitPoints.map((w, i) => ({
              id: w.id,
              name: w.name,
              position: { lat: w.lat, lng: w.lng },
              label: String(i + 1),
              state: 'upcoming',
              badge: `${w.lat.toFixed(3)}, ${w.lng.toFixed(3)}`,
            }))}
          />
        </div>

        <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
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
