import { useState } from 'react';
import { Plus, Save, MapPin } from 'lucide-react';
import { AdminTopBar } from '../components/layout';
import { Badge, Button, Card, SectionHeader } from '../components/ui';
import { routes, waitPoints } from '../data/mock';

export function AdminRoutes() {
  const [selectedId, setSelectedId] = useState<number>(routes[0].id);
  const route = routes.find((r) => r.id === selectedId)!;
  const [fares, setFares] = useState<number[]>(route.points.map((p) => p.segmentFare));

  function updateFare(i: number, v: string) {
    const n = Number(v.replace(/[^\d.]/g, '')) || 0;
    setFares((prev) => prev.map((x, idx) => (idx === i ? n : x)));
  }

  const totalFare = fares.slice(0, -1).reduce((a, b) => a + b, 0);

  return (
    <>
      <AdminTopBar
        title="Routes & fares"
        subtitle="Define route stops and per-segment pricing"
        actions={
          <Button size="sm" leftIcon={Plus}>
            New route
          </Button>
        }
      />

      <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl">
        {/* Route list */}
        <div className="lg:col-span-1 space-y-3">
          <SectionHeader title="All routes" />
          {routes.map((r) => (
            <Card
              key={r.id}
              padding="md"
              interactive
              onClick={() => {
                setSelectedId(r.id);
                setFares(r.points.map((p) => p.segmentFare));
              }}
              className={r.id === selectedId ? 'border-brand-400 ring-2 ring-brand-100' : ''}
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="font-display font-semibold text-text truncate">{r.name}</p>
                  <p className="text-xs text-text-muted">{r.points.length} stops</p>
                </div>
                <Badge tone="neutral">
                  ₦{r.points.slice(0, -1).reduce((a, b) => a + b.segmentFare, 0)}
                </Badge>
              </div>
            </Card>
          ))}
        </div>

        {/* Editor */}
        <div className="lg:col-span-2 space-y-5">
          <Card padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-xl text-text">{route.name}</h3>
                <p className="text-xs text-text-muted">Full end-to-end fare: ₦{totalFare.toLocaleString()}</p>
              </div>
              <Button leftIcon={Save}>Save changes</Button>
            </div>
          </Card>

          <Card padding="md">
            <SectionHeader
              title="Stops & segment fares"
              subtitle="Fare applies from this stop to the next stop on the route"
            />
            <ol className="relative space-y-3">
              {route.points.map((p, i) => {
                const wp = waitPoints.find((w) => w.id === p.waitPointId)!;
                const last = i === route.points.length - 1;
                return (
                  <li key={wp.id} className="flex items-center gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-brand-100 text-brand-700 text-xs font-semibold flex items-center justify-center">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-text truncate">{wp.name}</p>
                      <p className="text-[11px] text-text-muted inline-flex items-center gap-1">
                        <MapPin size={10} /> {wp.lat.toFixed(3)}, {wp.lng.toFixed(3)}
                      </p>
                    </div>
                    <div className="w-36">
                      {last ? (
                        <p className="text-[11px] text-text-faint text-right pr-3">Final stop</p>
                      ) : (
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-xs">₦</span>
                          <input
                            value={fares[i] || 0}
                            onChange={(e) => updateFare(i, e.target.value)}
                            className="w-full h-9 rounded-lg border border-border pl-7 pr-2 text-sm text-right focus:outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100/60"
                          />
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </Card>
        </div>
      </div>
    </>
  );
}
