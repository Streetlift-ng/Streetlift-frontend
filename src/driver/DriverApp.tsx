import { useState } from 'react';
import { LayoutDashboard, Car, CalendarClock, Wallet as WalletIcon, User } from 'lucide-react';
import { BottomNav } from '../components/layout';
import { DriverDashboard } from './Dashboard';
import { DriverTrips } from './Trips';
import { DriverVehicle } from './Vehicle';
import { DriverEarnings } from './Earnings';
import { DriverProfile } from './Profile';

type DriverTab = 'dashboard' | 'trips' | 'vehicle' | 'earnings' | 'profile';

export function DriverApp({ onSignOut }: { onSignOut: () => void }) {
  const [tab, setTab] = useState<DriverTab>('dashboard');

  return (
    <div className="min-h-screen pb-20">
      {tab === 'dashboard' && <DriverDashboard onNavigate={setTab} />}
      {tab === 'trips' && <DriverTrips />}
      {tab === 'vehicle' && <DriverVehicle />}
      {tab === 'earnings' && <DriverEarnings />}
      {tab === 'profile' && <DriverProfile onSignOut={onSignOut} />}

      <BottomNav<DriverTab>
        value={tab}
        onChange={setTab}
        items={[
          { id: 'dashboard', label: 'Drive', icon: LayoutDashboard },
          { id: 'trips', label: 'Trips', icon: CalendarClock, badge: 2 },
          { id: 'vehicle', label: 'Vehicle', icon: Car },
          { id: 'earnings', label: 'Earnings', icon: WalletIcon },
          { id: 'profile', label: 'Me', icon: User },
        ]}
      />
    </div>
  );
}
