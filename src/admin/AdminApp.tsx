import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Car,
  UserCheck,
  Route as RouteIcon,
  MapPin,
  CalendarClock,
  Wallet as WalletIcon,
  Settings,
} from 'lucide-react';
import { AdminShellProvider, SideNav, SideNavItem } from '../components/layout';
import { AdminDashboard } from './Dashboard';
import { AdminDrivers } from './Drivers';
import { AdminVehicles } from './Vehicles';
import { AdminRoutes } from './Routes';
import { AdminWaitPoints } from './WaitPoints';
import { AdminTrips } from './Trips';
import { AdminUsers } from './Users';
import { AdminWallets } from './Wallets';
import { AdminSettings } from './Settings';

type AdminPage =
  | 'dashboard'
  | 'drivers'
  | 'vehicles'
  | 'users'
  | 'routes'
  | 'wait-points'
  | 'trips'
  | 'wallets'
  | 'settings';

export function AdminApp({ onSignOut }: { onSignOut: () => void }) {
  const [page, setPage] = useState<AdminPage>('dashboard');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const items: SideNavItem<AdminPage>[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'Overview' },
    { id: 'drivers', label: 'Driver onboarding', icon: UserCheck, section: 'Operations', badge: 2 },
    { id: 'vehicles', label: 'Vehicles', icon: Car, section: 'Operations', badge: 2 },
    { id: 'trips', label: 'Trips', icon: CalendarClock, section: 'Operations' },
    { id: 'routes', label: 'Routes & fares', icon: RouteIcon, section: 'Network' },
    { id: 'wait-points', label: 'Wait points', icon: MapPin, section: 'Network' },
    { id: 'users', label: 'Users', icon: Users, section: 'People' },
    { id: 'wallets', label: 'Wallets', icon: WalletIcon, section: 'Finance' },
    { id: 'settings', label: 'Settings', icon: Settings, section: 'System' },
  ];

  return (
    <AdminShellProvider value={{ openSideNav: () => setDrawerOpen(true) }}>
      <div className="min-h-screen flex bg-bg">
        <SideNav<AdminPage>
          items={items}
          value={page}
          onChange={setPage}
          userName="Admin Desk"
          userRole="Operations · HQ"
          mobileOpen={drawerOpen}
          onMobileClose={() => setDrawerOpen(false)}
        />

        <div className="flex-1 min-w-0">
          {page === 'dashboard' && <AdminDashboard onNavigate={setPage} />}
          {page === 'drivers' && <AdminDrivers />}
          {page === 'vehicles' && <AdminVehicles />}
          {page === 'users' && <AdminUsers />}
          {page === 'routes' && <AdminRoutes />}
          {page === 'wait-points' && <AdminWaitPoints />}
          {page === 'trips' && <AdminTrips />}
          {page === 'wallets' && <AdminWallets />}
          {page === 'settings' && <AdminSettings onSignOut={onSignOut} />}
        </div>
      </div>
    </AdminShellProvider>
  );
}
