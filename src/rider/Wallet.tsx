import { useState } from 'react';
import {
  Wallet as WalletIcon,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Banknote,
  Shield,
  type LucideIcon,
} from 'lucide-react';
import { TopBar } from '../components/layout';
import { Badge, Button, Card, Input, Modal, SectionHeader } from '../components/ui';
import { walletTxns, type WalletTxn } from '../data/mock';

export function RiderWallet() {
  const [rechargeOpen, setRechargeOpen] = useState(false);
  const [amount, setAmount] = useState('');

  const balance = walletTxns[0].balanceAfter;

  return (
    <div>
      <TopBar title="Wallet" subtitle="Fund trips directly from your balance" />

      <main className="max-w-2xl mx-auto px-5 pt-5 space-y-6">
        <Card padding="lg" className="bg-ink-900 text-white border-0 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-brand-400/30 blur-3xl" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <p className="text-xs opacity-70 uppercase tracking-widest font-medium">Available</p>
              <Badge tone="brand" className="bg-brand-400/20 text-brand-300 border border-brand-400/40">
                Active
              </Badge>
            </div>
            <p className="text-4xl font-display font-bold mt-3">₦{balance.toLocaleString()}</p>
            <div className="mt-6 flex gap-2">
              <Button
                onClick={() => setRechargeOpen(true)}
                leftIcon={Plus}
                className="bg-brand-400 hover:bg-brand-500 text-white"
              >
                Top up
              </Button>
              <Button variant="secondary" className="bg-white/10 hover:bg-white/20 border-0">
                Withdraw
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-3 gap-2.5">
          <QuickAction icon={CreditCard} label="Cards" />
          <QuickAction icon={Banknote} label="Auto top-up" />
          <QuickAction icon={Shield} label="Limits" />
        </div>

        <section>
          <SectionHeader
            title="Recent activity"
            action={<button className="text-xs text-brand-700 font-medium hover:underline">Export CSV</button>}
          />
          <Card padding="none">
            {walletTxns.map((t, i) => (
              <TxnRow key={t.id} txn={t} last={i === walletTxns.length - 1} />
            ))}
          </Card>
        </section>
      </main>

      <Modal
        open={rechargeOpen}
        onClose={() => setRechargeOpen(false)}
        title="Top up wallet"
        footer={
          <Button
            fullWidth
            onClick={() => {
              setRechargeOpen(false);
              setAmount('');
            }}
            disabled={!amount}
          >
            Continue to payment
          </Button>
        }
      >
        <div className="space-y-4">
          <Input
            label="Amount"
            placeholder="0.00"
            leftIcon={WalletIcon}
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ''))}
          />
          <div className="grid grid-cols-4 gap-2">
            {[1000, 2000, 5000, 10000].map((v) => (
              <button
                key={v}
                onClick={() => setAmount(String(v))}
                className="h-9 rounded-full border border-border text-xs font-medium text-text hover:bg-surface-soft"
              >
                ₦{v.toLocaleString()}
              </button>
            ))}
          </div>
          <p className="text-xs text-text-faint">Payment secured by Paystack. Funds clear instantly.</p>
        </div>
      </Modal>
    </div>
  );
}

function QuickAction({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <button className="card p-3 hover:bg-surface-soft transition-colors flex flex-col items-center gap-1.5">
      <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center">
        <Icon size={16} />
      </div>
      <span className="text-xs font-medium text-text">{label}</span>
    </button>
  );
}

function TxnRow({ txn, last }: { txn: WalletTxn; last: boolean }) {
  const credit = txn.amount > 0;
  const Icon = credit ? ArrowDownLeft : ArrowUpRight;
  return (
    <div className={`flex items-center gap-3 px-4 py-3 ${!last ? 'border-b border-border' : ''}`}>
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
          credit ? 'bg-success-soft text-success' : 'bg-ink-100 text-text-muted'
        }`}
      >
        <Icon size={16} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-text truncate">{txn.reason}</p>
        <p className="text-[11px] text-text-muted">{txn.createdAt}</p>
      </div>
      <div className="text-right">
        <p className={`text-sm font-semibold ${credit ? 'text-success' : 'text-text'}`}>
          {credit ? '+' : ''}₦{Math.abs(txn.amount).toLocaleString()}
        </p>
        <p className="text-[11px] text-text-faint">Bal ₦{txn.balanceAfter.toLocaleString()}</p>
      </div>
    </div>
  );
}
