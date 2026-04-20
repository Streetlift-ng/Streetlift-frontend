import { useState } from 'react';
import { Plus, Minus, Search, Wallet as WalletIcon } from 'lucide-react';
import { AdminTopBar } from '../components/layout';
import { Badge, Button, Card, Input, Modal, SectionHeader } from '../components/ui';
import { riders } from '../data/mock';

export function AdminWallets() {
  const [adjustOpen, setAdjustOpen] = useState<null | 'credit' | 'debit'>(null);
  const [pickedUser, setPickedUser] = useState<(typeof riders)[number] | null>(null);

  return (
    <>
      <AdminTopBar
        title="Wallets"
        subtitle="Adjust balances and audit history"
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="outline" leftIcon={Minus} onClick={() => setAdjustOpen('debit')}>
              Debit
            </Button>
            <Button size="sm" leftIcon={Plus} onClick={() => setAdjustOpen('credit')}>
              Credit
            </Button>
          </div>
        }
      />

      <div className="p-6 space-y-5 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <SectionHeader title="Top wallets" />
            <Card padding="none">
              {riders.slice(0, 4).map((r, i, arr) => (
                <div
                  key={r.id}
                  className={`flex items-center justify-between px-4 py-3 ${
                    i !== arr.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-text">{r.name}</p>
                    <p className="text-[11px] text-text-muted">{r.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-text">₦{(8200 - i * 1400).toLocaleString()}</p>
                    <p className="text-[11px] text-text-muted">balance</p>
                  </div>
                </div>
              ))}
            </Card>
          </div>

          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-lg font-display font-semibold text-text">Recent adjustments</h2>
                <p className="text-xs text-text-muted">Admin-initiated credits and debits, system refunds</p>
              </div>
              <div className="w-56">
                <Input leftIcon={Search} placeholder="Search user" />
              </div>
            </div>
            <Card padding="none">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-text-muted uppercase tracking-wider border-b border-border">
                    <th className="px-5 py-3 font-medium">User</th>
                    <th className="px-5 py-3 font-medium">Type</th>
                    <th className="px-5 py-3 font-medium">Reason</th>
                    <th className="px-5 py-3 font-medium">When</th>
                    <th className="px-5 py-3 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { user: 'Amara Okoye', type: 'booking_refund', reason: 'Driver no-show #499', when: 'Apr 17 · 11:20', amount: 1300 },
                    { user: 'David Obi', type: 'admin_credit', reason: 'Referral bonus', when: 'Apr 16 · 09:04', amount: 500 },
                    { user: 'Zainab Yusuf', type: 'admin_debit', reason: 'Manual reversal', when: 'Apr 15 · 18:55', amount: -2100 },
                    { user: 'Kunle Bamgbose', type: 'deposit', reason: 'Paystack top-up', when: 'Apr 15 · 12:33', amount: 5000 },
                  ].map((t, i, arr) => (
                    <tr key={i} className={`text-sm ${i !== arr.length - 1 ? 'border-b border-border' : ''}`}>
                      <td className="px-5 py-3 font-medium text-text">{t.user}</td>
                      <td className="px-5 py-3">
                        <Badge tone={t.type === 'admin_debit' ? 'danger' : t.type === 'booking_refund' ? 'warning' : 'success'}>
                          {t.type.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-text-muted">{t.reason}</td>
                      <td className="px-5 py-3 text-text-muted">{t.when}</td>
                      <td className={`px-5 py-3 text-right font-semibold ${t.amount > 0 ? 'text-success' : 'text-danger'}`}>
                        {t.amount > 0 ? '+' : ''}₦{Math.abs(t.amount).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        </div>
      </div>

      <Modal
        open={!!adjustOpen}
        onClose={() => setAdjustOpen(null)}
        title={adjustOpen === 'credit' ? 'Credit a user wallet' : 'Debit a user wallet'}
        footer={
          <Button fullWidth onClick={() => setAdjustOpen(null)}>
            {adjustOpen === 'credit' ? 'Credit wallet' : 'Debit wallet'}
          </Button>
        }
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-muted">User</label>
            <select
              className="w-full h-11 rounded-xl border border-border bg-surface px-3 text-sm focus:outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100/60"
              onChange={(e) => setPickedUser(riders.find((r) => String(r.id) === e.target.value) ?? null)}
            >
              <option value="">Select user…</option>
              {riders.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} · {r.email}
                </option>
              ))}
            </select>
          </div>
          <Input label="Amount" placeholder="0.00" leftIcon={WalletIcon} />
          <Input label="Reason" placeholder={adjustOpen === 'credit' ? 'Goodwill, bonus…' : 'Reversal, chargeback…'} />
          {pickedUser && (
            <Card padding="sm" className="bg-surface-soft border-0">
              <p className="text-xs text-text-muted">Recipient</p>
              <p className="text-sm font-medium text-text">{pickedUser.name}</p>
            </Card>
          )}
        </div>
      </Modal>
    </>
  );
}
