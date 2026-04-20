import { useState } from 'react';
import { Home as HomeIcon, Map, Wallet as WalletIcon, User } from 'lucide-react';
import { BottomNav } from '../components/layout';
import { RiderHome } from './Home';
import { RiderTrips } from './Trips';
import { RiderWallet } from './Wallet';
import { RiderProfile } from './Profile';
import { RiderTrackRide } from './TrackRide';
import type { Booking } from '../data/mock';

type RiderTab = 'home' | 'trips' | 'wallet' | 'profile';

export function RiderApp({ onSignOut }: { onSignOut: () => void }) {
  const [tab, setTab] = useState<RiderTab>('home');
  const [trackingBooking, setTrackingBooking] = useState<Booking | null>(null);

  if (trackingBooking) {
    return <RiderTrackRide booking={trackingBooking} onBack={() => setTrackingBooking(null)} />;
  }

  return (
    <div className="min-h-screen pb-20">
      {tab === 'home' && <RiderHome onTrackBooking={setTrackingBooking} />}
      {tab === 'trips' && <RiderTrips onTrackBooking={setTrackingBooking} />}
      {tab === 'wallet' && <RiderWallet />}
      {tab === 'profile' && <RiderProfile onSignOut={onSignOut} />}

      <BottomNav<RiderTab>
        value={tab}
        onChange={setTab}
        items={[
          { id: 'home', label: 'Home', icon: HomeIcon },
          { id: 'trips', label: 'Trips', icon: Map, badge: 1 },
          { id: 'wallet', label: 'Wallet', icon: WalletIcon },
          { id: 'profile', label: 'Profile', icon: User },
        ]}
      />
    </div>
  );
}
