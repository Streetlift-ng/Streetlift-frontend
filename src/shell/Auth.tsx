import { FormEvent, useState } from 'react';
import { ArrowRight, Mail, Lock, User as UserIcon, Phone } from 'lucide-react';
import { Button, Card, Input } from '../components/ui';
import { BrandMark } from '../components/layout';
import type { Role } from '../data/mock';

type AuthView = 'login' | 'signup';

export function Auth({ onAuthenticated }: { onAuthenticated: (role: Role) => void }) {
  const [view, setView] = useState<AuthView>('login');
  const [role, setRole] = useState<Role>('rider');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onAuthenticated(role);
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <BrandMark size={36} />
        </div>

        <Card padding="lg" className="shadow-sm">
          <div className="text-center mb-6">
            <h1 className="font-display font-bold text-2xl text-text">
              {view === 'login' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-sm text-text-muted mt-1.5">
              {view === 'login'
                ? 'Sign in to keep your commute on schedule.'
                : 'Join riders on designated routes across the city.'}
            </p>
          </div>

          {view === 'signup' && (
            <div className="mb-5">
              <p className="text-xs font-medium text-text-muted mb-2">I am signing up as</p>
              <div className="grid grid-cols-2 gap-2 p-1 bg-surface-soft rounded-xl">
                {(['rider', 'driver'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`h-9 rounded-lg text-sm font-medium transition-colors capitalize ${
                      role === r ? 'bg-surface text-text shadow-sm' : 'text-text-muted'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              {role === 'driver' && (
                <p className="text-[11px] text-text-faint mt-2">
                  Driver accounts require admin approval and KYC documents.
                </p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {view === 'signup' && (
              <>
                <Input label="Full name" leftIcon={UserIcon} placeholder="Chidi Okeke" />
                <Input label="Phone" leftIcon={Phone} placeholder="+234 801 234 5678" />
              </>
            )}
            <Input label="Email" leftIcon={Mail} type="email" placeholder="you@streetlift.app" />
            <Input
              label="Password"
              leftIcon={Lock}
              type="password"
              placeholder="••••••••"
              hint={view === 'login' ? undefined : 'At least 8 characters'}
            />

            {view === 'login' && (
              <div className="flex justify-end">
                <button type="button" className="text-xs text-brand-700 font-medium hover:underline">
                  Forgot password?
                </button>
              </div>
            )}

            <Button type="submit" fullWidth rightIcon={ArrowRight}>
              {view === 'login' ? 'Sign in' : 'Create account'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-text-muted">
            {view === 'login' ? "Don't have an account?" : 'Already have one?'}{' '}
            <button
              type="button"
              onClick={() => setView(view === 'login' ? 'signup' : 'login')}
              className="text-brand-700 font-medium hover:underline"
            >
              {view === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </Card>

        <p className="text-center text-[11px] text-text-faint mt-6">
          By continuing you agree to StreetLift's Terms and Privacy Policy.
        </p>

        {view === 'login' && (
          <div className="mt-5 flex justify-center">
            <QuickSignin onPick={(r) => onAuthenticated(r)} />
          </div>
        )}
      </div>
    </div>
  );
}

function QuickSignin({ onPick }: { onPick: (r: Role) => void }) {
  return (
    <div className="inline-flex items-center gap-2 p-1 bg-surface border border-border rounded-full text-xs">
      <span className="pl-3 pr-1 text-text-faint">Demo:</span>
      {(['rider', 'driver', 'admin'] as Role[]).map((r) => (
        <button
          key={r}
          onClick={() => onPick(r)}
          className="capitalize px-3 h-7 rounded-full hover:bg-surface-soft font-medium text-text"
        >
          {r}
        </button>
      ))}
    </div>
  );
}
