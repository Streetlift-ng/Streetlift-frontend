import { ReactNode } from 'react';
import { LucideIcon, Bell } from 'lucide-react';
import { Avatar, IconButton, cx } from './ui';

// ---------- Brand mark ----------

export function BrandMark({ size = 28 }: { size?: number }) {
  return (
    <div className="inline-flex items-center gap-2.5">
      <div
        className="rounded-xl bg-brand-400 text-white flex items-center justify-center font-display font-bold"
        style={{ width: size, height: size, fontSize: size * 0.5 }}
      >
        S
      </div>
      <div className="leading-none">
        <div className="font-display font-bold tracking-tight text-text">StreetLift</div>
      </div>
    </div>
  );
}

// ---------- Mobile top bar ----------

export function TopBar({
  title,
  subtitle,
  right,
  onBack,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  onBack?: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 bg-bg/80 backdrop-blur-md border-b border-border">
      <div className="max-w-2xl mx-auto px-5 h-14 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {onBack && (
            <button onClick={onBack} className="text-text-muted hover:text-text text-sm">
              ←
            </button>
          )}
          <div className="min-w-0">
            <h1 className="font-display font-semibold text-text truncate leading-tight">{title}</h1>
            {subtitle && <p className="text-[11px] text-text-muted leading-tight">{subtitle}</p>}
          </div>
        </div>
        {right}
      </div>
    </header>
  );
}

// ---------- Mobile bottom nav ----------

export interface BottomNavItem<T extends string> {
  id: T;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

export function BottomNav<T extends string>({
  items,
  value,
  onChange,
}: {
  items: BottomNavItem<T>[];
  value: T;
  onChange: (id: T) => void;
}) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border">
      <div className="max-w-2xl mx-auto px-2 py-1.5 flex items-stretch justify-around">
        {items.map(({ id, label, icon: Icon, badge }) => {
          const active = id === value;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={cx(
                'flex-1 flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl transition-colors',
                active ? 'text-brand-600' : 'text-text-faint hover:text-text',
              )}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={active ? 2.2 : 1.6} />
                {!!badge && (
                  <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-brand-400 text-white text-[10px] font-semibold flex items-center justify-center">
                    {badge}
                  </span>
                )}
              </div>
              <span className={cx('text-[10px] font-medium', active && 'text-brand-700')}>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// ---------- Admin sidebar ----------

export interface SideNavItem<T extends string> {
  id: T;
  label: string;
  icon: LucideIcon;
  section?: string;
  badge?: string | number;
}

export function SideNav<T extends string>({
  items,
  value,
  onChange,
  userName,
  userRole,
}: {
  items: SideNavItem<T>[];
  value: T;
  onChange: (id: T) => void;
  userName: string;
  userRole: string;
}) {
  const sections = Array.from(new Set(items.map((it) => it.section ?? 'Main')));
  return (
    <aside className="hidden md:flex md:flex-col w-64 shrink-0 bg-surface border-r border-border h-screen sticky top-0">
      <div className="h-16 px-5 flex items-center border-b border-border">
        <BrandMark />
      </div>

      <nav className="flex-1 overflow-y-auto py-4 space-y-5 scroll-fade">
        {sections.map((section) => (
          <div key={section}>
            <p className="px-5 text-[10px] tracking-wider font-semibold uppercase text-text-faint mb-1.5">
              {section}
            </p>
            <ul className="px-3 space-y-0.5">
              {items
                .filter((it) => (it.section ?? 'Main') === section)
                .map(({ id, label, icon: Icon, badge }) => {
                  const active = id === value;
                  return (
                    <li key={id}>
                      <button
                        onClick={() => onChange(id)}
                        className={cx(
                          'w-full flex items-center gap-3 px-3 h-9 rounded-lg text-sm font-medium transition-colors',
                          active
                            ? 'bg-brand-100 text-brand-700'
                            : 'text-text-muted hover:bg-surface-soft hover:text-text',
                        )}
                      >
                        <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
                        <span className="flex-1 text-left">{label}</span>
                        {badge !== undefined && (
                          <span
                            className={cx(
                              'text-[10px] font-semibold px-1.5 py-0.5 rounded-full',
                              active ? 'bg-surface text-brand-700' : 'bg-ink-150 text-ink-700',
                            )}
                          >
                            {badge}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-border px-4 py-3 flex items-center gap-3">
        <Avatar name={userName} size={36} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-text truncate">{userName}</p>
          <p className="text-[11px] text-text-muted truncate">{userRole}</p>
        </div>
      </div>
    </aside>
  );
}

// ---------- Admin top bar ----------

export function AdminTopBar({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <header className="sticky top-0 z-20 bg-bg/90 backdrop-blur-md border-b border-border">
      <div className="px-6 h-16 flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-xl text-text leading-none">{title}</h1>
          {subtitle && <p className="text-xs text-text-muted mt-1">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {actions}
          <IconButton icon={Bell} label="Notifications" variant="outline" />
        </div>
      </div>
    </header>
  );
}
