import { TrendingUp, ArrowDownLeft, ArrowUpRight, Banknote } from 'lucide-react';
import { TopBar } from '../components/layout';
import { Button, Card, SectionHeader, StatCard } from '../components/ui';

export function DriverEarnings() {
  const txns = [
    { id: 1, label: 'Trip #101 · Lekki → CMS', amount: 6400, type: 'credit', at: 'Today · 08:45' },
    { id: 2, label: 'Trip #098 · Ikeja → Lekki', amount: 7200, type: 'credit', at: 'Yesterday · 19:10' },
    { id: 3, label: 'Withdrawal to bank', amount: -12000, type: 'debit', at: 'Apr 15 · 20:00' },
    { id: 4, label: 'Trip #093 · Ajah → VI', amount: 3100, type: 'credit', at: 'Apr 15 · 11:45' },
    { id: 5, label: 'Platform fee', amount: -640, type: 'debit', at: 'Apr 15 · 11:45' },
  ];

  const totalWeek = 84200;

  return (
    <div>
      <TopBar title="Earnings" subtitle="Your payouts and wallet activity" />

      <main className="max-w-2xl mx-auto px-5 pt-5 space-y-6">
        <Card padding="lg" className="bg-ink-900 text-white border-0 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-brand-400/30 blur-3xl" />
          <p className="text-xs opacity-70 uppercase tracking-widest font-medium relative">Available to withdraw</p>
          <p className="text-4xl font-display font-bold mt-2 relative">₦24,350</p>
          <div className="mt-5 flex gap-2 relative">
            <Button className="bg-brand-400 hover:bg-brand-500 text-white" leftIcon={Banknote}>
              Withdraw
            </Button>
            <Button variant="secondary" className="bg-white/10 hover:bg-white/20 border-0">
              Payout accounts
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-3 gap-3">
          <StatCard label="This week" value={`₦${(totalWeek / 1000).toFixed(1)}k`} icon={TrendingUp} tone="success" />
          <StatCard label="Trips" value="24" />
          <StatCard label="Avg / trip" value="₦3.5k" />
        </div>

        <section>
          <SectionHeader
            title="Recent activity"
            action={<button className="text-xs font-medium text-brand-700 hover:underline">Export</button>}
          />
          <Card padding="none">
            {txns.map((t, i) => {
              const credit = t.amount > 0;
              const Icon = credit ? ArrowDownLeft : ArrowUpRight;
              return (
                <div
                  key={t.id}
                  className={`flex items-center gap-3 px-4 py-3 ${i !== txns.length - 1 ? 'border-b border-border' : ''}`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      credit ? 'bg-success-soft text-success' : 'bg-ink-100 text-text-muted'
                    }`}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text truncate">{t.label}</p>
                    <p className="text-[11px] text-text-muted">{t.at}</p>
                  </div>
                  <p className={`text-sm font-semibold ${credit ? 'text-success' : 'text-text'}`}>
                    {credit ? '+' : ''}₦{Math.abs(t.amount).toLocaleString()}
                  </p>
                </div>
              );
            })}
          </Card>
        </section>
      </main>
    </div>
  );
}
