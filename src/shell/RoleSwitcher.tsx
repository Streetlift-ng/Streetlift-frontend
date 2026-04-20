import { useState } from 'react';
import { ChevronUp, LogOut, UserCog } from 'lucide-react';
import type { Role } from '../data/mock';

export function RoleSwitcher({
  role,
  onRoleChange,
  onSignOut,
}: {
  role: Role;
  onRoleChange: (r: Role) => void;
  onSignOut: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-24 md:bottom-5 right-4 z-[60]">
      {open && (
        <div className="mb-2 w-52 bg-surface border border-border rounded-2xl shadow-lg overflow-hidden text-sm">
          <div className="px-4 py-3 border-b border-border bg-surface-soft">
            <p className="text-[10px] uppercase tracking-wider font-semibold text-text-faint">
              Demo role switcher
            </p>
          </div>
          {(['rider', 'driver', 'admin'] as Role[]).map((r) => (
            <button
              key={r}
              onClick={() => {
                onRoleChange(r);
                setOpen(false);
              }}
              className={`w-full px-4 py-2.5 text-left hover:bg-surface-soft flex items-center justify-between capitalize ${
                role === r ? 'text-brand-700 font-medium' : 'text-text'
              }`}
            >
              {r}
              {role === r && <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />}
            </button>
          ))}
          <div className="border-t border-border">
            <button
              onClick={() => {
                onSignOut();
                setOpen(false);
              }}
              className="w-full px-4 py-2.5 text-left hover:bg-surface-soft flex items-center gap-2 text-text-muted"
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 px-3.5 h-10 rounded-full bg-ink-900 text-white text-xs font-medium shadow-lg hover:bg-ink-800 transition-colors"
      >
        <UserCog size={14} />
        <span className="capitalize">{role}</span>
        <ChevronUp size={14} className={open ? 'rotate-180 transition-transform' : 'transition-transform'} />
      </button>
    </div>
  );
}
