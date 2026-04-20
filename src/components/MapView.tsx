import { useEffect, useMemo, type ReactNode } from 'react';
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import L, { DivIcon, LatLngBoundsExpression, LatLngExpression } from 'leaflet';
import type { LatLng } from '../data/mock';

// ---------- Pin presets ----------

function divPin(html: string, size: [number, number] = [32, 40], anchor: [number, number] = [16, 40]): DivIcon {
  return L.divIcon({
    html,
    className: 'street-pin',
    iconSize: size,
    iconAnchor: anchor,
    popupAnchor: [0, -anchor[1]],
  });
}

export const pins = {
  stop: (label: string, state: 'upcoming' | 'current' | 'past' = 'upcoming') => {
    const bg = state === 'past' ? '#c7c7c7' : state === 'current' ? '#DEA193' : '#ffffff';
    const border = state === 'current' ? '#c88876' : '#808080';
    const fg = state === 'current' ? '#ffffff' : '#2a2a2a';
    return divPin(
      `<div style="display:flex;flex-direction:column;align-items:center;gap:2px">
         <div style="background:${bg};border:2px solid ${border};color:${fg};font-weight:600;font-size:10px;width:22px;height:22px;border-radius:999px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 4px rgba(0,0,0,0.15)">${label}</div>
         <div style="background:${border};width:2px;height:8px;border-radius:1px"></div>
       </div>`,
      [24, 32],
      [12, 32],
    );
  },

  vehicle: () =>
    divPin(
      `<div style="position:relative">
         <div style="position:absolute;inset:-6px;border-radius:999px;background:rgba(222,161,147,0.35);animation:pulse-dot 1.8s ease-out infinite"></div>
         <div style="position:relative;background:#DEA193;border:3px solid white;color:white;font-weight:700;width:34px;height:34px;border-radius:999px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.25)">
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
             <path d="M8 6v6"></path><path d="M15 6v6"></path><path d="M2 12h19.6"></path><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"></path><circle cx="7" cy="18" r="2"></circle><circle cx="16" cy="18" r="2"></circle>
           </svg>
         </div>
       </div>`,
      [34, 34],
      [17, 17],
    ),

  pickup: () =>
    divPin(
      `<div style="display:flex;flex-direction:column;align-items:center">
         <div style="background:#16a34a;color:white;font-weight:600;font-size:10px;padding:3px 8px;border-radius:6px;box-shadow:0 2px 6px rgba(0,0,0,0.2)">PICKUP</div>
         <div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:6px solid #16a34a;margin-top:-1px"></div>
       </div>`,
      [60, 22],
      [30, 22],
    ),

  dropoff: () =>
    divPin(
      `<div style="display:flex;flex-direction:column;align-items:center">
         <div style="background:#2a2a2a;color:white;font-weight:600;font-size:10px;padding:3px 8px;border-radius:6px;box-shadow:0 2px 6px rgba(0,0,0,0.2)">DROPOFF</div>
         <div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:6px solid #2a2a2a;margin-top:-1px"></div>
       </div>`,
      [62, 22],
      [31, 22],
    ),

  ridersWaiting: (count: number) =>
    divPin(
      `<div style="display:flex;flex-direction:column;align-items:center">
         <div style="background:white;border:2px solid #DEA193;color:#7d4a3c;font-weight:700;font-size:11px;padding:2px 8px;border-radius:999px;box-shadow:0 2px 6px rgba(0,0,0,0.2);display:flex;align-items:center;gap:4px;white-space:nowrap">
           <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="7" r="4"/><path d="M4 22a8 8 0 0116 0"/></svg>
           ${count} waiting
         </div>
         <div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:5px solid #DEA193"></div>
       </div>`,
      [88, 26],
      [44, 26],
    ),

  waitPoint: () =>
    divPin(
      `<div style="background:#DEA193;border:3px solid white;width:14px;height:14px;border-radius:999px;box-shadow:0 2px 6px rgba(0,0,0,0.25)"></div>`,
      [14, 14],
      [7, 7],
    ),
};

// ---------- Bounds helper ----------

function FitBounds({ points }: { points: LatLngExpression[] }) {
  const map = useMap();
  useEffect(() => {
    if (!points.length) return;
    if (points.length === 1) {
      map.setView(points[0], 14);
    } else {
      const bounds: LatLngBoundsExpression = points as [number, number][];
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [map, points]);
  return null;
}

// ---------- Generic stop sequence marker ----------

export interface StopMarker {
  id: number;
  name: string;
  position: LatLng;
  label?: string;
  state?: 'upcoming' | 'current' | 'past';
  badge?: string;
  onClick?: () => void;
}

export interface MapViewProps {
  height?: number | string;
  routePath?: LatLng[];
  stops?: StopMarker[];
  vehicle?: { position: LatLng; label?: string };
  pickup?: { position: LatLng; name?: string };
  dropoff?: { position: LatLng; name?: string };
  waitingBadges?: { position: LatLng; count: number; name?: string }[];
  children?: ReactNode;
}

export function MapView({
  height = 320,
  routePath,
  stops,
  vehicle,
  pickup,
  dropoff,
  waitingBadges,
  children,
}: MapViewProps) {
  const polyline = useMemo<LatLngExpression[]>(
    () => (routePath ?? []).map((p) => [p.lat, p.lng]),
    [routePath],
  );

  const fitPoints = useMemo<LatLngExpression[]>(() => {
    const pts: LatLngExpression[] = [];
    if (routePath) routePath.forEach((p) => pts.push([p.lat, p.lng]));
    if (stops) stops.forEach((s) => pts.push([s.position.lat, s.position.lng]));
    if (vehicle) pts.push([vehicle.position.lat, vehicle.position.lng]);
    if (pickup) pts.push([pickup.position.lat, pickup.position.lng]);
    if (dropoff) pts.push([dropoff.position.lat, dropoff.position.lng]);
    if (waitingBadges) waitingBadges.forEach((w) => pts.push([w.position.lat, w.position.lng]));
    return pts;
  }, [routePath, stops, vehicle, pickup, dropoff, waitingBadges]);

  const fallbackCenter: LatLngExpression = [6.465, 3.42]; // Lagos

  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-border bg-surface-soft"
      style={{ height }}
    >
      <MapContainer
        center={fitPoints[0] ?? fallbackCenter}
        zoom={12}
        scrollWheelZoom
        className="h-full w-full"
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; OSM &copy; CARTO'
        />

        {polyline.length >= 2 && (
          <Polyline
            positions={polyline}
            pathOptions={{ color: '#DEA193', weight: 5, opacity: 0.9, lineCap: 'round' }}
          />
        )}

        {stops?.map((s) => (
          <Marker
            key={`stop-${s.id}`}
            position={[s.position.lat, s.position.lng]}
            icon={pins.stop(s.label ?? String(s.id), s.state)}
            eventHandlers={s.onClick ? { click: s.onClick } : undefined}
          >
            <Popup>
              <div className="font-sans">
                <p className="text-sm font-semibold text-text">{s.name}</p>
                {s.badge && <p className="text-xs text-text-muted mt-0.5">{s.badge}</p>}
              </div>
            </Popup>
          </Marker>
        ))}

        {waitingBadges?.map((w, i) =>
          w.count > 0 ? (
            <Marker
              key={`wait-${i}`}
              position={[w.position.lat, w.position.lng]}
              icon={pins.ridersWaiting(w.count)}
              zIndexOffset={200}
            >
              <Popup>
                <div className="font-sans text-sm">
                  <p className="font-semibold text-text">{w.name ?? 'Wait point'}</p>
                  <p className="text-text-muted">{w.count} riders waiting</p>
                </div>
              </Popup>
            </Marker>
          ) : null,
        )}

        {pickup && (
          <Marker position={[pickup.position.lat, pickup.position.lng]} icon={pins.pickup()} zIndexOffset={300}>
            <Popup>
              <div className="font-sans text-sm">
                <p className="font-semibold text-text">Pickup</p>
                <p className="text-text-muted">{pickup.name ?? ''}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {dropoff && (
          <Marker position={[dropoff.position.lat, dropoff.position.lng]} icon={pins.dropoff()} zIndexOffset={300}>
            <Popup>
              <div className="font-sans text-sm">
                <p className="font-semibold text-text">Dropoff</p>
                <p className="text-text-muted">{dropoff.name ?? ''}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {vehicle && (
          <Marker
            position={[vehicle.position.lat, vehicle.position.lng]}
            icon={pins.vehicle()}
            zIndexOffset={400}
          >
            <Popup>
              <div className="font-sans text-sm">
                <p className="font-semibold text-text">Your ride</p>
                {vehicle.label && <p className="text-text-muted">{vehicle.label}</p>}
              </div>
            </Popup>
          </Marker>
        )}

        <FitBounds points={fitPoints} />
        {children}
      </MapContainer>
    </div>
  );
}

// Inject the pulse keyframes used by the vehicle pin (once, globally).
if (typeof document !== 'undefined' && !document.getElementById('streetlift-map-kf')) {
  const style = document.createElement('style');
  style.id = 'streetlift-map-kf';
  style.textContent = `
    @keyframes pulse-dot {
      0%   { transform: scale(1);   opacity: 0.7; }
      80%  { transform: scale(2.2); opacity: 0;   }
      100% { transform: scale(2.2); opacity: 0;   }
    }
    .street-pin { background: transparent !important; border: none !important; }
    .leaflet-container { font-family: var(--font-sans); background: #f4f4f4; }
    .leaflet-popup-content-wrapper { border-radius: 12px; }
    .leaflet-popup-content { margin: 10px 12px; }
  `;
  document.head.appendChild(style);
}
