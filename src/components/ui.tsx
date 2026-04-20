import { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode, ComponentType, forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}

// ---------- Button ----------

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  fullWidth?: boolean;
};

const buttonBase =
  'inline-flex items-center justify-center gap-2 font-medium rounded-full transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-bg';

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-brand-400 text-white hover:bg-brand-500 shadow-sm',
  secondary: 'bg-ink-800 text-white hover:bg-ink-900',
  ghost: 'text-text hover:bg-surface-soft',
  outline: 'border border-border bg-surface text-text hover:bg-surface-soft',
  danger: 'bg-danger text-white hover:bg-red-700',
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: 'px-3.5 h-8 text-xs',
  md: 'px-5 h-10 text-sm',
  lg: 'px-7 h-12 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', leftIcon: LI, rightIcon: RI, fullWidth, className, children, ...rest }, ref) => (
    <button
      ref={ref}
      className={cx(
        buttonBase,
        buttonVariants[variant],
        buttonSizes[size],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {LI && <LI size={size === 'lg' ? 18 : 16} />}
      {children}
      {RI && <RI size={size === 'lg' ? 18 : 16} />}
    </button>
  ),
);
Button.displayName = 'Button';

// ---------- IconButton ----------

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: LucideIcon;
  label: string;
  size?: 'sm' | 'md';
  variant?: 'ghost' | 'solid' | 'outline';
};

export function IconButton({ icon: Icon, label, size = 'md', variant = 'ghost', className, ...rest }: IconButtonProps) {
  const dim = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
  const iconSize = size === 'sm' ? 16 : 18;
  const variantCls = {
    ghost: 'text-text-muted hover:bg-surface-soft hover:text-text',
    solid: 'bg-ink-900 text-white hover:bg-ink-800',
    outline: 'border border-border bg-surface hover:bg-surface-soft',
  }[variant];
  return (
    <button
      aria-label={label}
      className={cx(
        'inline-flex items-center justify-center rounded-full transition-all active:scale-95',
        dim,
        variantCls,
        className,
      )}
      {...rest}
    >
      <Icon size={iconSize} />
    </button>
  );
}

// ---------- Card ----------

type CardProps = HTMLAttributes<HTMLDivElement> & {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
};

export function Card({ padding = 'md', interactive, className, children, ...rest }: CardProps) {
  const pad = { none: '', sm: 'p-4', md: 'p-5', lg: 'p-7' }[padding];
  return (
    <div
      className={cx(
        'card',
        pad,
        interactive && 'cursor-pointer transition-colors hover:bg-surface-soft',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

// ---------- Input ----------

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  leftIcon?: LucideIcon;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, leftIcon: LI, error, className, id, ...rest }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-text-muted">
            {label}
          </label>
        )}
        <div className="relative">
          {LI && (
            <LI size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-faint pointer-events-none" />
          )}
          <input
            id={inputId}
            ref={ref}
            className={cx(
              'w-full h-11 rounded-xl border border-border bg-surface text-sm text-text placeholder:text-text-faint',
              'focus:outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100/60 transition-all',
              LI ? 'pl-10 pr-3' : 'px-3.5',
              error && 'border-danger focus:border-danger focus:ring-red-100',
              className,
            )}
            {...rest}
          />
        </div>
        {(hint || error) && (
          <p className={cx('text-xs', error ? 'text-danger' : 'text-text-faint')}>{error ?? hint}</p>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';

// ---------- Badge / StatusPill ----------

type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

const toneClasses: Record<Tone, string> = {
  neutral: 'bg-ink-100 text-ink-700',
  brand: 'bg-brand-100 text-brand-700',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
  info: 'bg-info-soft text-info',
};

export function Badge({ tone = 'neutral', children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium',
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatusDot({ tone = 'neutral' }: { tone?: Tone }) {
  const bg = {
    neutral: 'bg-ink-400',
    brand: 'bg-brand-400',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
    info: 'bg-info',
  }[tone];
  return <span className={cx('inline-block w-1.5 h-1.5 rounded-full', bg)} />;
}

// ---------- Avatar ----------

export function Avatar({ name, size = 40, src }: { name: string; size?: number; src?: string }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
  return (
    <div
      className="inline-flex items-center justify-center rounded-full bg-brand-100 text-brand-700 font-semibold overflow-hidden shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {src ? <img src={src} alt={name} className="w-full h-full object-cover" /> : initials}
    </div>
  );
}

// ---------- StatCard ----------

export function StatCard({
  label,
  value,
  icon: Icon,
  delta,
  tone = 'neutral',
}: {
  label: string;
  value: string;
  icon?: LucideIcon;
  delta?: string;
  tone?: Tone;
}) {
  return (
    <Card padding="md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-text-muted font-medium">{label}</p>
          <p className="text-2xl font-display font-bold text-text mt-1.5">{value}</p>
          {delta && <p className="text-xs text-text-faint mt-1">{delta}</p>}
        </div>
        {Icon && (
          <div className={cx('w-9 h-9 rounded-xl inline-flex items-center justify-center', toneClasses[tone])}>
            <Icon size={18} />
          </div>
        )}
      </div>
    </Card>
  );
}

// ---------- Section Header ----------

export function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-4">
      <div>
        <h2 className="text-lg font-display font-semibold text-text">{title}</h2>
        {subtitle && <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ---------- Empty State ----------

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="text-center py-12 px-6">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-surface-soft text-text-muted mb-4">
        <Icon size={22} />
      </div>
      <h3 className="font-display font-semibold text-text">{title}</h3>
      {description && <p className="text-sm text-text-muted mt-1 max-w-sm mx-auto">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

// ---------- Simple Modal ----------

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink-900/40 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-surface w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl shadow-xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 hairline">
          <h3 className="font-display font-semibold text-text">{title}</h3>
          <button onClick={onClose} className="text-text-faint hover:text-text text-sm">
            Close
          </button>
        </div>
        <div className="px-5 py-5">{children}</div>
        {footer && <div className="px-5 py-4 border-t border-border bg-surface-soft">{footer}</div>}
      </div>
    </div>
  );
}

// ---------- Tabs ----------

export function Tabs<T extends string>({
  items,
  value,
  onChange,
}: {
  items: { id: T; label: string; count?: number }[];
  value: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 p-1 rounded-full bg-surface-soft border border-border">
      {items.map((it) => {
        const active = it.id === value;
        return (
          <button
            key={it.id}
            onClick={() => onChange(it.id)}
            className={cx(
              'px-4 h-8 rounded-full text-xs font-medium transition-all inline-flex items-center gap-1.5',
              active ? 'bg-surface text-text shadow-sm' : 'text-text-muted hover:text-text',
            )}
          >
            {it.label}
            {it.count !== undefined && (
              <span
                className={cx(
                  'text-[10px] px-1.5 rounded-full',
                  active ? 'bg-brand-100 text-brand-700' : 'bg-ink-150 text-ink-600',
                )}
              >
                {it.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export { cx };
