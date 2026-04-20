import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Splash } from './shell/Splash';
import { Auth } from './shell/Auth';
import { RoleSwitcher } from './shell/RoleSwitcher';
import { RiderApp } from './rider/RiderApp';
import { DriverApp } from './driver/DriverApp';
import { AdminApp } from './admin/AdminApp';
import type { Role } from './data/mock';

type AppState = 'splash' | 'auth' | 'app';

export default function App() {
  const [state, setState] = useState<AppState>('splash');
  const [role, setRole] = useState<Role>('rider');

  return (
    <div className="min-h-screen bg-bg text-text">
      <AnimatePresence mode="wait">
        {state === 'splash' && (
          <motion.div key="splash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Splash onDone={() => setState('auth')} />
          </motion.div>
        )}

        {state === 'auth' && (
          <motion.div
            key="auth"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <Auth
              onAuthenticated={(r) => {
                setRole(r);
                setState('app');
              }}
            />
          </motion.div>
        )}

        {state === 'app' && (
          <motion.div
            key={`app-${role}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {role === 'rider' && <RiderApp onSignOut={() => setState('auth')} />}
            {role === 'driver' && <DriverApp onSignOut={() => setState('auth')} />}
            {role === 'admin' && <AdminApp onSignOut={() => setState('auth')} />}
          </motion.div>
        )}
      </AnimatePresence>

      {state === 'app' && (
        <RoleSwitcher role={role} onRoleChange={setRole} onSignOut={() => setState('auth')} />
      )}
    </div>
  );
}
